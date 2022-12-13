import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateLetterStudentDto } from './dto/create-letter_student.dto';
import { UpdateLetterStudentDto } from './dto/update-letter_student.dto';
import { LetterStudent, LetterStudentDocument } from './letter_student.schema';

@Injectable()
export class LetterStudentService {
  constructor(
    @InjectModel(LetterStudent.name)
    private readonly letterStudentModel: Model<LetterStudentDocument>,
  ) {}
  async create(createLetterStudentDto: CreateLetterStudentDto) {
    const students = createLetterStudentDto.students.map((id_student) => {
      return {
        id_letter: +createLetterStudentDto.id_letter,
        id_student: id_student,
      };
    });
    const result = await this.letterStudentModel.insertMany(students);
    return result;
  }

  async statistic(id_student: number, month: number, year: number) {
    const result = await this.letterStudentModel.aggregate([
      {
        $match: {
          id_student: id_student,
        },
      },
      {
        $lookup: {
          from: 'tbl_letter',
          localField: 'id_letter',
          foreignField: '_id',
          as: 'letter',
        },
      },
      {
        $unwind: '$letter',
      },
      {
        $lookup: {
          from: 'tbl_company',
          localField: 'letter.id_account',
          foreignField: '_id',
          as: 'company',
        },
      },
      {
        $unwind: '$company',
      },
    ]);
    return { data: result };
  }

  findAll() {
    return `This action returns all letterStudent`;
  }

  findOne(id: number) {
    return `This action returns a #${id} letterStudent`;
  }

  update(id: number, updateLetterStudentDto: UpdateLetterStudentDto) {
    return `This action updates a #${id} letterStudent`;
  }

  remove(id: number) {
    return `This action removes a #${id} letterStudent`;
  }
}
