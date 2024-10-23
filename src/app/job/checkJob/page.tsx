"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

import { Card, CardContent } from "@/components/ui/card";
import { Loader } from "@/components/ui/loader";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { UserCombobox } from "./components/switcher";
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
    return <div>Loading...</div>;
  }

  return (
    <DefaultLayout>
      <Breadcrumb pageName="每日支票任务" />

      <div className="flex-col">
        <div className="flex-1 ">
          <div className="flex items-center justify-between">
            <UserCombobox initialValue={pathname} />
            <Link href="/profile/addresses/new">
              <Button>
                <PlusIcon className="mr-2 h-4" /> Add New
              </Button>
            </Link>
          </div>
          {checkJobs ? (
            <CheckJobsTable data={checkJobs} />
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
