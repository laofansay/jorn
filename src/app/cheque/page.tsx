"use client";
import React, { useState } from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import PdfViewer from '@/components//pdf/PdfViewer'; // Ensure you have the PdfViewer component imported


const FormElementsPage = () => {
  const [images, setImages] = useState([]);
  const [pdfUrl, setPdfUrl] = useState(null);  // State to hold generated PDF URL

  const handleFileChange = (event: any) => {
    setImages(event.target.files);
  };

  const uploadSubmit = async (event: any) => {
    event.preventDefault();
    const formData = new FormData();
    for (let i = 0; i < images.length; i++) {
      formData.append("files", images[i]);
    }
    try{

      const response = await fetch("http://localhost:9090/api/pdf/generate", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);  // Create object URL for PDF

      setPdfUrl(url);  // Set the URL to display the PDF in PdfViewer

      
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  return (
    <DefaultLayout>
      {/* <!-- File upload --> */}
      <div className="items-top h-screen justify-start rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <form onSubmit={uploadSubmit} encType="multipart/form-data">
          <div className="flex flex-col gap-5.5 p-6.5">
            <div>
              <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                请上传支票图片(规格:612px*257px)
              </label>
              <input
                multiple
                name="files"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:px-5 file:py-3 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white dark:focus:border-primary"
              />
            </div>
            <button
              type="submit"
              className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
            >
              上传文件
            </button>
            {pdfUrl && (
          <div className="mt-2">
            <PdfViewer fileUrl={pdfUrl} /> {/* Display the generated PDF */}
          </div>
        )}
          </div>
          
        </form>
    </div>
       
    </DefaultLayout>
  );
};

export default FormElementsPage;
