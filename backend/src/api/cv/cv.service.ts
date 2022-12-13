import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  bucketName,
  FileUploadService,
} from 'src/share/external-services/s3.service';
import { FieldCvService } from '../field_cv/field_cv.service';
import { CV, CVDocument } from './cv.schema';
import { CreateCvDto } from './dto/create-cv.dto';
import { UpdateCvDto } from './dto/update-cv.dto';
// import { imgbbUploader } from 'imgbb-uploader';
import { QueryParamCVDto } from './dto/query-param-cv.dto';
import { ManuCompanyService } from '../manu-company/manu-company.service';
import { LetterService } from '../letter/letter.service';
import * as moment from 'moment';
import * as _ from 'lodash';

@Injectable()
export class CvService {
  constructor(
    @InjectModel(CV.name) private readonly cvModel: Model<CVDocument>,
    private readonly fieldCvService: FieldCvService,
    private readonly manuCompanyService: ManuCompanyService,
    private readonly letterService: LetterService,
    private readonly fileUploadService: FileUploadService,
  ) {}
  async create(createCvDto: CreateCvDto, file_cv: Express.Multer.File) {
    const {
      title,
      id_student,
      status,
      fields,
      experience,
      summary,
      certificate,
      speciality,
    } = createCvDto;
    const dataCreate: any = {
      title,
      experience,
      summary,
      certificate,
      speciality,
      id_student: +id_student,
      file_cv,
      status: status === 'false' ? false : true,
      _id: createCvDto.id_student,
      create_date: moment().utc(true),
    };
    if (file_cv) {
      console.log('file_cv', file_cv);
      const path = file_cv.path.split('\\');
      dataCreate.file_cv = `${path[1]}/${path[2]}`;
    }
    // return;
    const resultCreate = await this.cvModel.create(dataCreate);
    console.log(resultCreate);
    const fieldsArray = fields.split(',');
    const fieldsNumber = fieldsArray.map((field) => {
      return +field;
    });
    const dataCreateFieldCV = { id_cv: id_student, fields: fieldsNumber };
    const createFieldCV = await this.fieldCvService.create(dataCreateFieldCV);
    return resultCreate;
  }

  async findOne(id: number) {
    const data = await this.cvModel.aggregate([
      {
        $match: {
          _id: id,
        },
      },
      {
        $lookup: {
          from: 'tbl_student',
          localField: 'id_student',
          foreignField: '_id',
          as: 'student',
        },
      },
      {
        $unwind: '$student',
      },
      {
        $lookup: {
          from: 'tbl_account',
          localField: 'student._id',
          foreignField: '_id',
          as: 'account',
        },
      },
      {
        $unwind: '$account',
      },
      {
        $lookup: {
          from: 'tbl_field_cv',
          localField: '_id',
          foreignField: 'id_cv',
          as: 'field_cv',
        },
      },
      {
        $lookup: {
          from: 'tbl_field',
          localField: 'field_cv.id_field',
          foreignField: '_id',
          as: 'fields',
        },
      },
    ]);
    return { data: data[0] };
  }

  async update(
    id: number,
    updateCvDto: UpdateCvDto,
    file_cv?: Express.Multer.File,
  ) {
    const {
      fields,
      title,
      status,
      update_id,
      experience,
      summary,
      certificate,
      speciality,
    } = updateCvDto;
    console.log('fields', fields);
    const dataUpdate: any = {
      title,
      experience,
      summary,
      certificate,
      speciality,
      status: status === 'true' ? true : false,
      update_id: +update_id,
      update_date: moment().utc(true),
    };
    if (file_cv) {
      console.log('file_cv', file_cv);
      const path = file_cv.path.split('\\');
      dataUpdate.file_cv = `${path[1]}/${path[2]}`;
    }
    if (fields) {
      const fieldsArray = fields.split(',');
      const fieldsNumber = fieldsArray.map((field) => {
        return +field;
      });
      const dataCreateFieldCV = { id_cv: id, fields: fieldsNumber };
      const createFieldCV = await this.fieldCvService.create(dataCreateFieldCV);
    }
    const resultUpdate = await this.cvModel.updateOne({ _id: id }, dataUpdate);
    console.log(resultUpdate);
    return resultUpdate;
  }

  async suggest(id_company: number, query: any) {
    const { pageIndex = 1, pageSize = 5 } = query;
    const manufacture = await this.manuCompanyService.findNameManu(id_company);
    console.log('manufacture', manufacture);
    //suggest by experience
    const studentMail = await this.letterService.findLetterStudent(id_company);
    const fieldhint = studentMail
      ? _.uniq([...manufacture, ...studentMail.field])
      : [...manufacture];
    console.log('fieldhint', fieldhint);
    let isExperience = {};
    if (studentMail) {
      console.log('studentMail', studentMail);
      const min = studentMail.experience.min;
      const max = studentMail.experience.max;
      console.log(min, max);
      if (min === 0) {
        if (max === 0) {
          isExperience = {
            $eq: ['$experience', 0],
          };
        }
        if (max < 12) {
          isExperience = {
            $and: [{ $gte: ['$experience', 0] }, { $lt: ['$experience', 12] }],
          };
        }
        isExperience = true;
      }
      if (min >= 12) {
        isExperience = {
          $gte: ['$experience', 12],
        };
      }
      if (min > 0 && min < 12) {
        if (max < 12) {
          isExperience = {
            $and: [{ $gt: ['$experience', 0] }, { $lt: ['$experience', 12] }],
          };
        } else {
          isExperience = {
            $gt: ['$experience', 0],
          };
        }
      }
    } else {
      isExperience = true;
    }
    console.log('isExperience', isExperience);

    const hintList = await this.cvModel.aggregate([
      {
        $lookup: {
          from: 'tbl_student',
          localField: 'id_student',
          foreignField: '_id',
          as: 'student',
        },
      },
      {
        $unwind: '$student',
      },
      {
        $lookup: {
          from: 'tbl_account',
          localField: 'student._id',
          foreignField: '_id',
          as: 'account',
        },
      },
      {
        $unwind: '$account',
      },
      {
        $match: {
          'account.delete_date': null,
          delete_date: null,
          status: true,
          // ...condition,
        },
      },
      //add field
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
                id_fields: {
                  $push: '$field_name.nameField',
                },
              },
            },
          ],
        },
      },
      {
        $unwind: '$field_cv',
      },
      {
        $addFields: {
          isExperience: isExperience,
          isField: {
            $setIntersection: ['$field_cv.id_fields', fieldhint],
          },
        },
      },
      {
        $addFields: {
          numberField: { $size: '$isField' },
        },
      },
      {
        $match: {
          isExperience: true,
          numberField: { $ne: 0 },
        },
      },
      {
        $sort: { numberField: -1 },
      },
    ]);

    return {
      total: Math.ceil(hintList.length / pageSize),
      data: _.slice(hintList, (pageIndex - 1) * pageSize, pageIndex * pageSize),
    };
    return { data: hintList };
    // return { data: studentMail };
  }

  async findAll(query: QueryParamCVDto) {
    const {
      field,
      status,
      search,
      id_student,
      experience,
      speciality,
      pageIndex,
      pageSize,
    } = query;

    console.log('field', field);
    console.log('status', status);
    console.log('search', search);
    console.log('pageIndex', pageIndex);
    console.log('pageSize', pageSize);
    console.log('id_student', id_student);

    let isExperience = {};
    switch (experience) {
      case '0': {
        isExperience = {
          $eq: ['$experience', 0],
        };
        break;
      }
      case '1': {
        isExperience = {
          $and: [{ $gt: ['$experience', 0] }, { $lt: ['$experience', 12] }],
        };
        break;
      }
      case '2': {
        isExperience = {
          $gte: ['$experience', 12],
        };
        break;
      }
      default: {
        isExperience = true;
        break;
      }
    }

    const rgx = (pattern) => new RegExp(`.*${pattern}.*`);
    const searchRgx = rgx(search ? search : '');
    let specialityCheck: any = [true];
    if (speciality) {
      const array = speciality.split(',').map((item) => {
        return item.trim();
      });
      specialityCheck = array.map((item) => {
        return {
          $regexMatch: {
            input: '$speciality',
            regex: rgx(item.replace('+', '\\+')),
            options: 'i',
          },
        };
      });
    }

    const condition = {};
    if (status === '1') {
      condition['status'] = true;
    }
    if (status === '0') {
      condition['status'] = false;
    }
    if (id_student) {
      condition['id_student'] = +id_student;
    }

    let field_condition: any = true;
    if (field && +field) {
      field_condition = { $in: [+field, '$id_fields'] };
    } else {
      if (field && field.length) {
        const field_array = field.split(',');
        const conditionOr = field_array.map((item) => {
          return { $in: [+item, '$id_fields'] };
        });
        field_condition = { $or: conditionOr };
      }
    }
    console.log('field_condition', field_condition);
    let limitSkip = [];
    if (pageIndex && pageSize) {
      limitSkip = [
        {
          $skip: (+pageIndex - 1) * +pageSize,
        },
        {
          $limit: +pageSize,
        },
      ];
    }
    const cvList = await this.cvModel.aggregate([
      //account not delete
      {
        $lookup: {
          from: 'tbl_student',
          localField: 'id_student',
          foreignField: '_id',
          as: 'student',
        },
      },
      {
        $unwind: '$student',
      },
      {
        $lookup: {
          from: 'tbl_account',
          localField: 'student._id',
          foreignField: '_id',
          as: 'account',
        },
      },
      {
        $unwind: '$account',
      },
      {
        $match: {
          'account.delete_date': null,
          delete_date: null,
          'student.status': true,
          ...condition,
        },
      },
      // //add field
      {
        $lookup: {
          from: 'tbl_field_cv',
          localField: '_id',
          foreignField: 'id_cv',
          as: 'field_cv',
          pipeline: [
            {
              $group: {
                _id: '$id_cv',
                id_fields: {
                  $push: '$id_field',
                },
              },
            },
          ],
        },
      },
      {
        $unwind: '$field_cv',
      },
      {
        $addFields: {
          //search
          result: {
            $and: [
              {
                $regexMatch: {
                  input: '$title',
                  regex: searchRgx,
                  options: 'i',
                },
              },
              {
                $or: [...specialityCheck],
              },
            ],
          },
          id_fields: '$field_cv.id_fields',
        },
      },
      {
        $addFields: {
          isfields: field_condition,
          isExperience: isExperience,
        },
      },
      {
        $match: {
          result: true,
          isfields: true,
          isExperience: true,
        },
      },
      {
        $lookup: {
          from: 'tbl_field',
          localField: 'id_fields',
          foreignField: '_id',
          as: 'fields',
        },
      },
      ...limitSkip,
    ]);
    let total = 0;
    if (cvList.length) {
      //calculate total
      const studentListTotal = await this.cvModel.aggregate([
        //account not delete
        {
          $lookup: {
            from: 'tbl_student',
            localField: 'id_student',
            foreignField: '_id',
            as: 'student',
          },
        },
        {
          $unwind: '$student',
        },
        {
          $lookup: {
            from: 'tbl_account',
            localField: 'student._id',
            foreignField: '_id',
            as: 'account',
          },
        },
        {
          $unwind: '$account',
        },
        {
          $match: {
            'account.delete_date': null,
            delete_date: null,
            ...condition,
          },
        },
        //add field
        {
          $lookup: {
            from: 'tbl_field_cv',
            localField: '_id',
            foreignField: 'id_cv',
            as: 'field_cv',
            pipeline: [
              {
                $group: {
                  _id: '$id_cv',
                  id_fields: {
                    $push: '$id_field',
                  },
                },
              },
            ],
          },
        },
        {
          $unwind: '$field_cv',
        },
        {
          $addFields: {
            //search
            result: {
              $and: [
                {
                  $regexMatch: {
                    input: '$title',
                    regex: searchRgx,
                    options: 'i',
                  },
                },
                {
                  $or: [...specialityCheck],
                },
              ],
            },
            id_fields: '$field_cv.id_fields',
          },
        },
        {
          $addFields: {
            isfields: field_condition,
          },
        },
        {
          $match: {
            result: true,
            isfields: true,
            // isExperience: true,
          },
        },
        {
          $lookup: {
            from: 'tbl_field',
            localField: 'id_fields',
            foreignField: '_id',
            as: 'fields',
          },
        },
        {
          $count: 'total',
        },
      ]);
      total = studentListTotal[0].total;
    }
    console.log(cvList);
    return {
      data: cvList,
      pageSize: +pageIndex,
      pageIndex: +pageSize,
      total: total,
    };
  }
}
