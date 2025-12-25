'use client'

import { Button } from "@/components/ui/button"
import axios, { isAxiosError } from "axios"
import { ArrowRight, Loader2, Upload } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import React, { useRef, useState } from "react"
import { toast } from "sonner"

export default function UpdateAvatar() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleImageSelection = () => {
        fileInputRef.current?.click()
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setSelectedFile(file)
        } else {
            console.error("No file selected")
        }
    }

    const handleImageUpload = async () => {
        if (!selectedFile) {
            return
        }
        const form = new FormData()
        form.append("avatar", selectedFile)
        setIsLoading(true)

        try {
            const res = await axios.post(`/api/protected/update-avatar`, form, { withCredentials: true })
            if (res.status == 200) {
                router.push('/chats')
            }
        } catch (error) {
            if (isAxiosError(error)) {
                const errorMessage = error.response?.data?.message
                toast.error(errorMessage || "Server error")
            }
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="h-screen bg-linear-to-br from-orange-50 via-white to-orange-50 flex justify-center items-center flex-col">
            <header className="bg-white/80 backdrop-blur-md border-b border-orange-100 fixed w-full top-0 z-40">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <h1 className="text-lg font-semibold text-gray-900">Add Avatar</h1>
                        <div className="w-24"></div>
                        <Button variant="ghost" asChild className="text-gray-600 hover:text-orange-600">
                            <Link href="/chats" className="flex items-center space-x-2">
                                <span>Skip for now</span>
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </header>

            <div className="bg-white w-1/3 h-1/2 rounded-2xl border border-primary/30 p-10 flex justify-center items-center flex-col gap-10">
                <h1 className="text-xl font-medium">Upload avatar</h1>

                <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                />

                <div
                    onClick={handleImageSelection}
                    className="cursor-pointer w-2/3 h-4/5 border-2 border-dashed border-zinc-400/50 rounded-2xl flex gap-7 justify-center items-center flex-col">
                    {selectedFile ? (
                        <Image src={URL.createObjectURL(selectedFile)} alt="Avatar preview" width={1000} height={1000} className="w-24 h-24 rounded-full object-cover border" />
                    ) : (
                        <div className="bg-primary/10 rounded-full size-20 flex justify-center items-center">
                            <Upload className="size-10 text-primary" />
                        </div>
                    )}
                    <p className="text-zinc-500">
                        {selectedFile ? selectedFile.name : "Select file by clicking here!"}
                    </p>
                </div>

                <Button disabled={isLoading} className="cursor-pointer" variant={"default"} onClick={() => handleImageUpload()} >
                    {
                        isLoading ? <span><Loader2 className="text-white animate-spin" /></span> : "Upload"
                    }
                </Button>
            </div>
        </div>
    )
}
