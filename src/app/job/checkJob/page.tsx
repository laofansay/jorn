"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

import { Card, CardContent } from "@/components/ui/card";
import { Loader } from "@/components/ui/loader";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CheckJobsTable } from "./components/table";

import {
  getEntities,
  reset,
} from "@/app/shared/reducers/entities/check-job.reducer";
import { useAppDispatch, useAppSelector } from "@/store";
import { useEffect } from "react";

export default async function CheckJobPage({
  params,
}: {
  params: { id: string };
}) {
  const pathname = usePathname();

  const dispatch = useAppDispatch();

  const checkJobs = useAppSelector((state) => state.checkJob.entities);
  const loading = useAppSelector((state) => state.checkJob.loading);

  const getAllEntities = () => {
    dispatch(
      getEntities({
        sort: `id,desc`,
      }),
    );
  };

  useEffect(() => {
    getAllEntities();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <DefaultLayout>
      <Breadcrumb pageName="每日支票任务" />

      <div className="h-[80vh] rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="flex-1 ">
          <div className="flex items-center justify-between">
            <Link href="/job/checkJob/new">
              <Button>
                <PlusIcon className="mr-2 h-4" /> Add New
              </Button>
            </Link>
          </div>
          {checkJobs ? (
            <CheckJobsTable data={checkJobs.slice()} />
          ) : (
            <Card className="my-2">
              <CardContent>
                <div className="h-[20vh]">
                  <div className="my-4 flex h-full items-center justify-center">
                    <Loader />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DefaultLayout>
  );
}
