"use client";

import {
  getEntity,
  reset,
} from "@/app/shared/reducers/entities/check-job.reducer";
import { useAppDispatch, useAppSelector } from "@/store";
import { useEffect } from "react";

import { CheckJobForm } from "./components/check-job-form";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

export default async function AddressPage({
  params,
}: {
  params: { checkJobId: string };
}) {
  const dispatch = useAppDispatch();

  const checkJob = useAppSelector((state) => state.checkJob.entity);

  const isEditing = params.checkJobId !== "new";
  useEffect(() => {
    if (isEditing) {
      dispatch(getEntity(params.checkJobId));
    } else {
      dispatch(reset());
    }
  }, []);
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Google Drive 任务" />
      <div className="h-[80vh] rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <CheckJobForm checkJob={checkJob} isEditing={isEditing} />
        </div>
      </div>
    </DefaultLayout>
  );
}
