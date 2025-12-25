"use client"

import GoogleButton from "@/components/layout/Google"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { UserSchema, userSchema } from "@/types/userTypes"
import { zodResolver } from "@hookform/resolvers/zod"
import axios, { isAxiosError } from "axios"
import { AlertCircle, Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

export default function SignUp() {
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const { register, handleSubmit, reset, formState: { errors } } = useForm<UserSchema>({
        resolver: zodResolver(userSchema),
        mode: "onChange"
    })

    const handleLoginUser = async (data: UserSchema) => {
        try {
            setIsLoading(true)
            const res = await axios.post(`/api/user/sign-in`, { ...data }, { withCredentials: true })
            console.log(res);
            if (res.status === 200) {
                if (res.data?.data?.isNew == true) {
                    router.push('/update-avatar')
                    return
                }
                router.push('/chats')
            }
        } catch (error) {
            if (isAxiosError(error)) {
                const errorMessage = error.response?.data?.message
                toast.error(errorMessage || "Server error")
            }
        } finally {
            setIsLoading(false)
            reset()
        }
    }

    return (
        <>
            <div className="w-full h-screen flex justify-center items-center ">
                <div className="min-w-lg h-auto border border-primary/20 rounded-2xl shadow shadow-amber-300/20 p-10" >
                    <form onSubmit={handleSubmit(handleLoginUser)} className="w-full h-full flex flex-col gap-1.5">
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
                            <Button className="cursor-pointer h-10" >
                                {
                                    isLoading ? (<span> <Loader2 className="animate-spin" /> </span>) : "Submit"
                                }
                            </Button>
                            <Separator />
                            {/* <GoogleButton /> */}
                            <div className="w-full flex justify-center items-center gap-1" >
                                <p className="text-sm text-zinc-600">Don't have an account ?</p>
                                <Link href={"/auth/sign-up"} className="text-sm text-primary underline" > Register </Link>
                            </div>
                        </div>
                    </form>
                </div >
            </div >
        </>
    )
}