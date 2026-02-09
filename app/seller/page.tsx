'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { uploadProduct } from '../lib/actions';
import Image from 'next/image';

export default function SellerPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [preview, setPreview] = useState<string>('');

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/signin');
        }
    }, [status, router]);

    if (!session?.user) return null;

    const userId = session.user.id;
    const uploadWithId = uploadProduct.bind(null, userId);

    // 달러 -> 센트 변환 로직
    const handleFormSubmit = async (formData: FormData) => {
        const rawPrice = formData.get('price');
        if (rawPrice) {
            const dollars = parseFloat(rawPrice.toString());
            const cents = Math.round(dollars * 100);
            formData.set('price', cents.toString());
        }
        await uploadWithId(formData);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const objectUrl = URL.createObjectURL(file);
            setPreview(objectUrl);
        }
    };

    return (
        // 배경을 base-100으로 설정하여 테마에 맞게 변경
        <div className="max-w-xl mx-auto mt-10 mb-10  p-10 bg-base-100 rounded-xl shadow-2xl">
            <h1 className="text-2xl font-bold mb-8 text-base-content w-fit border-b-2 border-primary">Add <span className='text-primary'>New Product</span></h1>

            <form action={handleFormSubmit} className="flex flex-col gap-4">

                {/* 1. Image Upload */}
                <div className="flex flex-col gap-2">
                    <label className="font-bold text-base-content">Product Image</label>
                    <div className="flex items-start">
                        <label className="cursor-pointer group">
                            <input
                                type="file"
                                name="image"
                                accept="image/*"
                                required
                                onChange={handleImageChange}
                                className="hidden"
                            />
                            {/* base-200, base-300을 사용하여 은은한 박스 생성 */}
                            <div className="w-32 h-32 border-2 border-dashed border-base-300 rounded-lg flex flex-col items-center justify-center bg-base-200 group-hover:bg-base-300 transition-colors overflow-hidden relative">
                                {preview ? (
                                    <Image
                                        src={preview}
                                        alt="Preview"
                                        className="w-full h-full object-cover"
                                        fill
                                    />
                                ) : (
                                    <>
                                        {/* 아이콘 색상도 base-content의 투명도를 조절하여 자연스럽게 */}
                                        <svg className="w-8 h-8 text-base-content/50 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                                        </svg>
                                        <span className="text-xs text-base-content/70 font-medium">Upload</span>
                                    </>
                                )}
                            </div>
                        </label>
                    </div>
                </div>

                {/* 2. Product Name */}
                <div className="flex flex-col gap-2">
                    <label className="font-bold text-base-content">Product Name</label>
                    <input
                        type="text"
                        name="title"
                        required
                        placeholder="Type here"
                        // focus될 때 테두리를 primary 색상으로 변경
                        className="input input-bordered w-full focus:border-primary focus:outline-none"
                    />
                </div>

                {/* 3. Description */}
                <div className="flex flex-col gap-2">
                    <label className="font-bold text-base-content">Product Description</label>
                    <textarea
                        name="description"
                        rows={5}
                        placeholder="Type here"
                        className="textarea textarea-bordered w-full text-base focus:border-primary focus:outline-none"
                    ></textarea>
                </div>

                {/* 4. Grid Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Category */}
                    <div className="flex flex-col gap-2">
                        <label className="font-bold text-base-content">Category</label>
                        <select
                            name="category"
                            required
                            defaultValue=""
                            className="select select-bordered w-full focus:border-primary focus:outline-none"
                        >
                            <option value="" disabled>Select Category</option>
                            <option value="jewelry">jewelry</option>
                            <option value="electronics">electronics</option>
                            <option value="men's clothing
">men's clothing</option>
                            <option value="women's clothing
">women's clothing
                            </option>
                        </select>
                    </div>

                    {/* Price */}
                    <div className="flex flex-col gap-2">
                        <label className="font-bold text-base-content">Product Price ($)</label>
                        <input
                            type="number"
                            name="price"
                            required
                            step="0.01"
                            placeholder="0.00"
                            className="input input-bordered w-full focus:border-primary focus:outline-none"
                        />
                    </div>
                </div>

                {/* 5. Submit Button */}
                <div className="mt-4">
                    {/* DaisyUI btn-primary 사용 -> 자동으로 primary 색상 및 텍스트 색상 적용 */}
                    <button
                        type="submit"
                        className="btn btn-primary w-32 font-bold"
                    >
                        ADD
                    </button>
                </div>

            </form>
        </div>
    );
}