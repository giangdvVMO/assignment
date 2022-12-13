import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { sendEmail } from 'src/share/external-services/send-mail.service';
import { CompanyService } from '../company/company.service';
import { LetterStudentService } from '../letter_student/letter_student.service';
import { UserService } from '../user/user.service';
import { ConditionLetterDto, CreateLetterDto } from './dto/create-letter.dto';
import { UpdateLetterDto } from './dto/update-letter.dto';
import { Letter, LetterDocument } from './letter.schema';
import * as _ from 'lodash';
import * as moment from 'moment';

@Injectable()
export class LetterService {
  constructor(
    @InjectModel(Letter.name)
    private readonly letterModel: Model<LetterDocument>,
    private readonly letterStudentService: LetterStudentService,
    private readonly userService: UserService,
    private readonly companyService: CompanyService,
  ) {}
  async calculateId() {
    //create id
    const count: any = await this.letterModel.aggregate([
      {
        $group: {
          _id: null,
          max: {
            $max: '$_id',
          },
        },
      },
    ]);
    console.log(count);
    return count.length ? count[0].max + 1 : 1;
  }

  async findCondition(conditionLetterDto: ConditionLetterDto) {
    const result = await this.letterModel.aggregate([
      {
        $match: {
          id_account: +conditionLetterDto.id_company,
        },
      },
      {
        $lookup: {
          from: 'tbl_letter_student',
          localField: '_id',
          foreignField: 'id_letter',
          as: 'letter_student',
        },
      },
      {
        $unwind: '$letter_student',
      },
      {
        $match: {
          'letter_student.id_student': +conditionLetterDto.id_student,
        },
      },
    ]);
    return { data: result };
  }

  async findLetterStudent(id_company: number) {
    const students = await this.letterModel.aggregate([
      {
        $match: {
          id_account: id_company,
        },
      },
      {
        $lookup: {
          from: 'tbl_letter_student',
          localField: '_id',
          foreignField: 'id_letter',
          as: 'letter',
          pipeline: [
            {
              $lookup: {
                from: 'tbl_student',
                localField: 'id_student',
                foreignField: '_id',
                as: 'student',
              },
            },
            {
              $lookup: {
                from: 'tbl_cv',
                localField: 'id_student',
                foreignField: '_id',
                as: 'cv',
                pipeline: [
                  {
                    $lookup: {
                      from: 'tbl_field_cv',
                      localField: '_id',
                      foreignField: 'id_cv',
                      as: 'field_cv',
                      pipeline: [
                        {
                          $lookup: {
                            from: 'tbl_field',
                            localField: 'id_field',
                            foreignField: '_id',
                            as: 'field_name',
                          },
                        },
                        {
                          $unwind: '$field_name',
                        },
                        {
                          $group: {
                            _id: '$id_cv',
                            fieldId: { $push: '$field_name.nameField' },
                            // fieldId: { $push: '$id_field' },
                          },
                        },
                      ],
                    },
                  },
                  {
                    $unwind: '$field_cv',
                  },
                ],
              },
            },
            {
              $unwind: '$student',
            },
            {
              $unwind: '$cv',
            },
          ],
        },
      },
      {
        $unwind: '$letter',
      },
    ]);
    // return students;
    const field = [];
    const experience = [];
    if (!students.length) return null;
    students.forEach((item) => {
      field.push(...item.letter.cv.field_cv.fieldId);
      experience.push(item.letter.cv.experience);
    });
    const min = _.min(experience);
    const max = _.max(experience);
    return {
      field: _.uniq(field),
      experience: { min, max },
    };
  }

  async create(createLetterDto: CreateLetterDto) {
    const _id = await this.calculateId();
    console.log('_id', _id);
    const result = await this.letterModel.create({
      ...createLetterDto,
      _id: _id,
      create_date: moment().utc(true),
    });

    if (result) {
      this.letterStudentService.create({
        id_letter: _id,
        students: createLetterDto.students,
      });
    }
    createLetterDto.students.forEach((id_student) => {
      this.sendMail(
        id_student,
        +createLetterDto.id_account,
        createLetterDto.title,
        createLetterDto.content,
      );
    });

    return result;
  }

  async sendMail(
    id_student: number,
    id_company: number,
    title: string,
    content: string,
  ) {
    const account_student = await this.userService.findOneByCondition({
      _id: id_student,
    });
    console.log('account_student', account_student);
    const account_company = await this.userService.findOneByCondition({
      _id: id_company,
    });
    console.log('account_company', account_company);
    const company = await this.companyService.findOne(id_company);
    console.log('company', company.data);

    sendEmail(
      title,
      account_company.email,
      company.data,
      account_student,
      content,
    );
  }

  findAll() {
    return `This action returns all letter`;
  }

  findOne(id: number) {
    return `This action returns a #${id} letter`;
  }

  update(id: number, updateLetterDto: UpdateLetterDto) {
    return `This action updates a #${id} letter`;
  }

  remove(id: number) {
    return `This action removes a #${id} letter`;
  }
}
