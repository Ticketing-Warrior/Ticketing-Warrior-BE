class CustomError extends Error {
    constructor(message, statusCode = 500) {
        super(message);
        this.statusCode = statusCode;

        Object.setPrototypeOf(this, new.target.prototype);

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

class BadRequestError extends CustomError {
    constructor(message = '잘못된 요청입니다.') {
    super(message, 400);
    }
}

class NotFoundError extends CustomError {
    constructor(message = '내용을 찾을 수 없습니다.') {
        super(message, 404);
    }
}

class NotFoundUserError extends CustomError {
	constructor(message = "유저를 찾을 수 없습니다.") {
		super(message, 404);
	}
}

class ExistsError extends CustomError {
    constructor(message = '이미 존재하는 리소스 입니다.') {
    super(message, 409);
    }
}

class InternalServerError extends CustomError {
    constructor(message = '서버 에러') {
    super(message, 500);
    }
}

class WrongUserInfo extends CustomError {
    constructor(message='정보 일치하지 않음'){
        super(message, 401);
    }
}

export {
    CustomError,
    NotFoundError,
    NotFoundUserError,
    BadRequestError,
    InternalServerError,
    ExistsError,
    WrongUserInfo
};