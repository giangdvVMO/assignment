import { swaggerSchemaExample } from '../../share/utils/swagger_schema';

export const USER_CONST = {
  MODEL_NAME: 'user',
  MODEL_PROVIDER: 'USER_MODEL',
};

export enum UserTypes {
  ADMIN = 1,
  USER = 2,
}

export enum UserGender {
  MAN = 1,
  WOMEN = 2,
}

export enum UserPosition {
  PM = 1,
  Dev = 2,
  Tester = 3,
}

export enum UserStatus {
  ACTIVE = 1,
  INACTIVE = 0,
}

export const USER_SWAGGER_RESPONSE = {
  CREATE_SUCCESS: swaggerSchemaExample(
    {
      data: {
        id: '1',
        created_at: '2022-08-23T02:21:16.992Z',
        updated_at: '2022-08-23T02:21:16.992Z',
        deleted_at: null,
        name: 'Administrator',
        email: 'bach.nguyen@vmodev.com',
        type: 1,
        is_administrator: true,
        status: 1,
        created_by: null,
        country: null,
        city: null,
        postal_code: null,
        phone: null,
        expired_date: null,
      },
    },
    'Create success',
  ),
  UPDATE_SUCCESS: swaggerSchemaExample(
    {
      data: {
        success: true,
      },
    },
    'Update success',
  ),
  CREATE_MULTIPLE_SUCCESS: swaggerSchemaExample(
    {
      data: {
        totalSuccess: 1,
        totalError: 0,
      },
    },
    'Create success',
  ),
  GET_USER_SUCCESS: swaggerSchemaExample(
    {
      data: {
        id: '1',
        created_at: '2022-08-23T02:21:16.992Z',
        updated_at: '2022-08-23T02:21:16.992Z',
        deleted_at: null,
        name: 'Administrator',
        email: 'bach.nguyen@vmodev.com',
        type: 1,
        is_administrator: true,
        status: 1,
        created_by: null,
        phone: null,
        expired_date: null,
      },
    },
    'get user success',
  ),
  NOT_FOUND_EXCEPTION: swaggerSchemaExample(
    {
      message: 'not found exception',
      code: 'us00001',
      statusCode: 404,
    },
    'not found exception',
  ),
  BAD_REQUEST_CONFIRM_PASSWORD: swaggerSchemaExample(
    {
      message: 'Confirm password is not match new password ',
      code: 'us00006',
      statusCode: 400,
    },
    'bad request',
  ),
  BAD_REQUEST_WRONG_PASSWORD: swaggerSchemaExample(
    {
      message: 'Password does not match',
      code: 'us00005',
      statusCode: 400,
    },
    'bad request',
  ),
  BAD_REQUEST_USER_EXISTED: swaggerSchemaExample(
    {
      message: 'User existed',
      code: 'us00004',
      statusCode: 400,
    },
    'bad request',
  ),
  DELETE_SUCCESS: swaggerSchemaExample(
    {
      data: {
        success: true,
      },
    },
    'Delete success',
  ),
  GET_LIST_SUCCESS: swaggerSchemaExample(
    {
      data: [
        {
          id: '1',
          created_at: '2022-09-06T06:46:11.121Z',
          updated_at: '2022-09-06T06:46:11.121Z',
          deleted_at: null,
          name: 'Administrator',
          email: 'admin@gmail.com',
          type: 1,
          is_administrator: true,
          status: 1,
          created_by: null,
          phone: null,
          expired_date: null,
          last_login: null,
        },
      ],
      total: 1,
      page: 1,
      pageSize: 2,
      totalPage: 1,
    },
    'get List User',
  ),
  BAD_REQUEST_EXCEPTION: swaggerSchemaExample(
    {
      message: 'bad exception',
      code: 'sys00001',
      statusCode: 400,
    },
    'bad request exception',
  ),
};
