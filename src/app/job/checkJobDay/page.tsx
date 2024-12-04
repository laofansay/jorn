"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { useAppDispatch, useAppSelector } from "@/store";
import { getEntities } from "@/app/shared/reducers/entities/check-job-day.reducer";
import { useEffect } from "react";
import { CheckJobDaysTable } from "./components/table";
import { CardContent } from "@/components/ui/card";
import { Loader } from "@/components/ui/loader";
import Addjob from "./components/addJob";

export default async function CheckJobDayPage({
  params,
}: {
  params: { id: string };
}) {
  const dispatch = useAppDispatch();
  const checkJobDays = useAppSelector((state) => state.checkJobDay.entities);
  const loading = useAppSelector((state) => state.checkJobDay.loading);

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
            <Addjob />
          </div>
          {checkJobDays ? (
            <CheckJobDaysTable data={checkJobDays} />
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
