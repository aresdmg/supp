"use client"

import GoogleButton from "@/components/layout/Google"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { UserSchema, userSchema } from "@/types/userTypes"
import { zodResolver } from "@hookform/resolvers/zod"
import { AlertCircle } from "lucide-react"
import { useForm } from "react-hook-form"

export default function SignUp() {
    const { register, handleSubmit, reset, formState: { errors, isValid } } = useForm<UserSchema>({
        resolver: zodResolver(userSchema),
        mode: "onChange"
    })

    return (
        <>
            <div className="w-full h-screen flex justify-center items-center ">
                <div className="min-w-lg h-auto border border-primary/20 rounded-2xl shadow shadow-amber-300/20 p-10" >
                    <form className="w-full h-full flex flex-col gap-1.5">
                        <div className="w-full flex justify-center items-center flex-col space-y-1.5" >
                            <h1 className="text-2xl font-semibold"> Login into Supp account </h1>
                            <p className="text-sm text-zinc-600"> Enter your credentials to get started </p>
                        </div>
                        <div className="w-full h-full mt-5 flex flex-col gap-5">
                            <div className="w-full flex flex-col space-y-1.5" >
                                <Label>Email</Label>
                                <Input type="email" placeholder="e.g. johndoe@example.com" className="h-10" {...register("email")} />
                                {
                                    errors.email &&
                                    <p className="text-red-600 text-sm flex justify-start items-center gap-1" >
                                        <AlertCircle className="size-4" />
                                        {errors.email?.message}
                                    </p>
                                }
                            </div>
                            <div className="w-full flex flex-col space-y-1.5" >
                                <Label>Password</Label>
                                <Input type="password" placeholder="Enter your secure password" className="h-10" {...register("password")} />
                                {
                                    errors.password &&
                                    <p className="text-red-600 text-sm flex justify-start items-center gap-1" >
                                        <AlertCircle className="size-4" />
                                        {errors.password?.message}
                                    </p>
                                }
                            </div>
                            <Button className="cursor-pointer h-10" disabled={isValid ? false : true} >
                                Submit
                            </Button>
                            <Separator />
                            <GoogleButton />
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}