"use client";
import React, { useEffect, useState } from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import PdfViewer from "@/components//pdf/PdfViewer"; // Ensure you have the PdfViewer component imported
import { useAppDispatch, useAppSelector } from "@/store";
import { downloadEntity } from "@/app/shared/reducers/entities/check-job-day.reducer";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { useSearchParams } from "next/navigation";

const ViewPdfPage = () => {
  const dispatch = useAppDispatch();
  const links = useAppSelector((state) => state.checkJobDay.links);
  const loading = useAppSelector((state) => state.checkJobDay.loading);

  const searchParam = useSearchParams();

  const id = searchParam.get("id") as string;
  const day = searchParam.get("day") as string;

  useEffect(() => {
    dispatch(downloadEntity({ id, day }));
  }, [dispatch, id, day]); // Add dispatch to the dependency array

  // 监控 links 的值，帮助调试
  useEffect(() => {
    console.log("PDF 链接:", links);
  }, [links]);
  if (loading) {
    return <div>Loading...</div>;
  }
  // 确保 PDF 链接存在
  if (!links || typeof links !== "string") {
    return <div>没有可用的 PDF 文件。</div>;
  }
  return (
    <DefaultLayout>
      <Breadcrumb pageName="打印预览" />
      {/* <!-- File upload --> */}
      <div className="items-top h-[80vh] justify-start rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <span>PDF 链接: {links}</span>
        <PdfViewer fileUrl={links} /> {/* Display the generated PDF */}
      </div>
    </DefaultLayout>
  );
};
export default ViewPdfPage;
