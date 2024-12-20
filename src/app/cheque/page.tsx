"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import PdfViewer from "@/components/pdf/PdfViewer";
import axios from "axios";

const Settings = () => {
  const [image, setImage] = useState<string | null>(null);
  const [previeImage, setPrevieImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      if (selectedFile.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPrevieImage(reader.result as string); // 设置图片预览
          setPdfFile(null); // 清除 PDF 预览
        };
        reader.readAsDataURL(selectedFile);
      } else if (selectedFile.type === "application/pdf") {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPdfFile(reader.result as string); // 设置 PDF 预览
          setPrevieImage(null); // 清除图片预览
        };
        reader.readAsDataURL(selectedFile); // 将 PDF 文件转换为 data URL
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      alert("请选择一个文件");
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("/api/pdf/generate", formData, {
        headers: {
          "Content-Type": "multipart/form-data", // 可以省略，axios 会自动设置
        },
        responseType: "blob", // 告诉 axios 期望接收二进制数据
      });

      if (response.status !== 200) {
        throw new Error("上传失败");
      }

      const blob = await response.data;
      const imageUrl = URL.createObjectURL(blob);
      setImage(imageUrl);
      console.info("blob url:", imageUrl);
    } catch (error) {
      console.error("上传错误:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DefaultLayout>
      <div className="mx-auto max-w-full">
        <Breadcrumb pageName="支票裁剪助手" />

        <div className="grid grid-cols-5 gap-8">
          <div className="col-span-5 ">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                  请上传一张支票文件
                </h3>
              </div>
              <div className="p-7">
                <form onSubmit={handleSubmit}>
                  <div
                    id="FileUpload"
                    className="relative mb-5.5 block w-full cursor-pointer appearance-none rounded border border-dashed border-primary bg-gray px-4 py-4 dark:bg-meta-4 sm:py-7.5"
                  >
                    <input
                      onChange={handleFileChange}
                      type="file"
                      accept="image/*,application/pdf"
                      className="absolute inset-0 z-50 m-0 h-full w-full cursor-pointer p-0 opacity-0 outline-none"
                    />
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full border border-stroke bg-white dark:border-strokedark dark:bg-boxdark">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M1.99967 9.33337C2.36786 9.33337 2.66634 9.63185 2.66634 10V12.6667C2.66634 12.8435 2.73658 13.0131 2.8616 13.1381C2.98663 13.2631 3.1562 13.3334 3.33301 13.3334H12.6663C12.8431 13.3334 13.0127 13.2631 13.1377 13.1381C13.2628 13.0131 13.333 12.8435 13.333 12.6667V10C13.333 9.63185 13.6315 9.33337 13.9997 9.33337C14.3679 9.33337 14.6663 9.63185 14.6663 10V12.6667C14.6663 13.1971 14.4556 13.7058 14.0806 14.0809C13.7055 14.456 13.1968 14.6667 12.6663 14.6667H3.33301C2.80257 14.6667 2.29387 14.456 1.91879 14.0809C1.54372 13.7058 1.33301 13.1971 1.33301 12.6667V10C1.33301 9.63185 1.63148 9.33337 1.99967 9.33337Z"
                            fill="#3C50E0"
                          />
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M7.5286 1.52864C7.78894 1.26829 8.21106 1.26829 8.4714 1.52864L11.8047 4.86197C12.0651 5.12232 12.0651 5.54443 11.8047 5.80478C11.5444 6.06513 11.1223 6.06513 10.8619 5.80478L8 2.94285L5.13807 5.80478C4.87772 6.06513 4.45561 6.06513 4.19526 5.80478C3.93491 5.54443 3.93491 5.12232 4.19526 4.86197L7.5286 1.52864Z"
                            fill="#3C50E0"
                          />
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M7.99967 1.33337C8.36786 1.33337 8.66634 1.63185 8.66634 2.00004V10C8.66634 10.3682 8.36786 10.6667 7.99967 10.6667C7.63148 10.6667 7.33301 10.3682 7.33301 10V2.00004C7.33301 1.63185 7.63148 1.33337 7.99967 1.33337Z"
                            fill="#3C50E0"
                          />
                        </svg>
                      </span>
                      <p>
                        <span className="text-primary">Click to upload</span> or
                        drag and drop
                      </p>
                      <p className="mt-1.5">PDF, PNG, JPG</p>
                      <p>(max, 800 X 800px)</p>
                    </div>
                  </div>
                  <div className="flex justify-end gap-4.5">
                    <Button
                      className="flex justify-center rounded bg-primary px-6 py-2 font-medium text-gray hover:bg-opacity-90"
                      type="submit"
                    >
                      上传
                    </Button>
                  </div>
                </form>
              </div>
              <div className="px-7">
                {previeImage && (
                  <div className="relative mb-5.5 flex h-64 w-full cursor-pointer items-center justify-center rounded border border-dashed border-primary bg-gray-100 px-4 py-4 dark:bg-gray-800 sm:py-7.5">
                    <img
                      src={previeImage}
                      alt="source check"
                      className="max-h-full max-w-full rounded-lg object-contain shadow-md"
                    />
                  </div>
                )}

                {/* 如果上传了 PDF，显示 PDF 预览 */}
                {pdfFile && (
                  <div className="flexw-full relative mb-5.5 h-150 cursor-pointer items-center justify-center rounded border border-dashed border-primary bg-gray-100 px-4 py-4 dark:bg-gray-800 sm:py-7.5">
                    <PdfViewer fileUrl={pdfFile} />
                  </div>
                )}
              </div>

              {isLoading && <p>Uploading...</p>}
              <div className="px-7">
                <div className="relative mb-5.5 flex h-64 w-full cursor-pointer items-center justify-center rounded border border-dashed border-primary bg-gray-100 px-4 py-4 dark:bg-gray-800 sm:py-7.5">
                  {image && (
                    <img
                      src={image}
                      alt="check"
                      className="max-h-full max-w-full rounded-lg object-contain shadow-md"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Settings;
