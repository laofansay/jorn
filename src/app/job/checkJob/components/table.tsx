"use client";

import { ICheckJob } from "@/app/shared/model/check-job.model";
import { partialUpdateEntity } from "@/app/shared/reducers/entities/check-job.reducer";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { useAppDispatch, useAppSelector } from "@/store";
import { ColumnDef } from "@tanstack/react-table";
import { EditIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

interface CheckJobsTableProps {
  data: ICheckJob[];
}
export const CheckJobsTable: React.FC<{ data: ICheckJob[] }> = ({ data }) => {
  const dispatch = useAppDispatch();
  const updateSuccess = useAppSelector((state) => state.checkJob.updateSuccess);

  useEffect(() => {
    if (updateSuccess) {
      toast.success("success");
    }
  }, [updateSuccess]);

  // 假设这个函数用于更新默认地址
  const updateDefaultAddress = async (addressId: number) => {
    const entity = {
      id: addressId,
      master: true,
    };
    dispatch(partialUpdateEntity(entity));
  };

  const columns: ColumnDef<ICheckJob>[] = [
    {
      accessorKey: "id",
      header: "任务ID",
    },
    {
      accessorKey: "jobName",
      header: "任务名称",
    },
    {
      accessorKey: "tag",
      header: "标签",
    },
    {
      accessorKey: "rootFolderName",
      header: "远程目录",
    },
    {
      accessorKey: "rootFolderId",
      header: "目录ID",
    },
    {
      id: "actions",
      header: "操作",
      cell: ({ row }) => (
        <Link href={`/job/checkJob/${row.original.id}`}>
          <Button size="icon" variant="outline">
            <EditIcon className="h-4" />
          </Button>
        </Link>
      ),
    },
  ];

  return <DataTable searchKey="products" columns={columns} data={data} />;
};
