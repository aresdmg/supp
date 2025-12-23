import { NextResponse } from "next/server";

export class ExtendedResposne {
    public static success<T>(statusCode: number = 200, data: T | null, message: string = "Success") {
        return NextResponse.json(
            {
                data,
                statusCode,
                message
            },
            {
                status: statusCode
            }
        )
    }

    public static error(statusCode: number = 400, message: string = "Something went wrong", errors?: unknown) {
        return NextResponse.json(
            {
                message,
                statusCode,
                errors
            },
            {
                status: statusCode
            }
        )
    }
}
