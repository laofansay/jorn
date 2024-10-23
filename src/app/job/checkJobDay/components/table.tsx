"use client";

import { ICheckJobDay } from "@/app/shared/model/check-job-day.model";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { useAppDispatch, useAppSelector } from "@/store";
import { ColumnDef } from "@tanstack/react-table";
import { Printer } from "lucide-react";
import { CircuitBoard } from "lucide-react";
import Link from "next/link";
import { Tooltip } from "@nextui-org/react";
import { Logs } from "lucide-react";

import { downloadEntity } from "@/app/shared/reducers/entities/check-job-day.reducer";

export const CheckJobDaysTable: React.FC<ICheckJobDay[]> = ({ data }) => {
  const dispatch = useAppDispatch();

  const triggerDownload = (blob: Blob, filename: string) => {
    const url = window.URL.createObjectURL(new Blob([blob]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename); // Specify the file name
    document.body.appendChild(link);
    link.click();
    link.remove();
  };
  const handleDownload = async (
    id?: number | undefined,
    day?: string | undefined,
    resultFileName?: string | null | undefined,
  ) => {
    const resultAction = await dispatch(downloadEntity({ id, day }));
    if (downloadEntity.fulfilled.match(resultAction)) {
      const blob = resultAction.payload;
      triggerDownload(blob, resultFileName);
    } else {
      console.error("Download failed:", resultAction.payload);
    }
  };

  const rebuild = async (event: any) => {};

  const view = async (event: any) => {};

  const columns: ColumnDef<ICheckJobDay>[] = [
    {
      accessorKey: "id",
      header: "id",
    },
    {
      accessorKey: "day",
      header: "日期",
    },

    {
      header: "任务名称",
      cell: ({ row }) => {
        return row.original.checkJob.name;
      },
    },
    {
      accessorKey: "parentFolderName",
      header: "上级目录",
    },
    {
      accessorKey: "jobStatus",
      header: "状态",
    },
    {
      accessorKey: "num",
      header: "文件总数",
    },
    {
      accessorKey: "success",
      header: "成功数",
    },
    {
      accessorKey: "ignore",
      header: "无效数",
    },
    {
      accessorKey: "jobMsg",
      header: "原因",
    },
    {
      header: "合并文件",
      cell: ({ row }) => {
        return row.original.jobStatus == "COMPLETED" ? (
          <Tooltip
            content="点击下载"
            placement="top"
            className="rounded-lg bg-gray-300 p-2  text-sm  text-black shadow-lg transition-opacity duration-300"
          >
            <a
              onClick={() =>
                handleDownload(
                  row.original.id,
                  row.original.day,
                  row.original.resultFileName,
                )
              }
              className="text-blue-600 underline hover:text-blue-800"
            >
              {row.original.resultFileName}
            </a>
          </Tooltip>
        ) : (
          <div>---</div>
        );
      },
    },

    {
      accessorKey: "createdDate",
      header: "操作时间",
    },

    {
      id: "actions",
      header: "操作",
      cell: ({ row }) => (
        <div>
          <Tooltip
            content="预算和打印"
            placement="top"
            className="rounded-lg bg-gray-300 p-2  text-sm  text-black shadow-lg transition-opacity duration-300"
          >
            <Link
              href={`/job/view?id=${row.original.id}&day=${row.original.day}`}
            >
              <Button size="icon" variant="outline">
                <Printer className="h-4" />
              </Button>
            </Link>
          </Tooltip>

          <Tooltip
            content="重新生成"
            placement="top"
            className="rounded-lg bg-gray-300 p-2  text-sm  text-black shadow-lg transition-opacity duration-300"
          >
            <Link href={`/profile/addresses/${row.original.id}`}>
              <Button size="icon" variant="outline">
                <CircuitBoard className="h-4" />
              </Button>
            </Link>
          </Tooltip>

          <Tooltip
            content="查看解析日志"
            placement="top"
            className="rounded-lg bg-gray-300 p-2  text-sm  text-black shadow-lg transition-opacity duration-300"
          >
            <Link href={`/profile/addresses/${row.original.id}`}>
              <Button size="icon" variant="outline">
                <Logs className="h-4" />
              </Button>
            </Link>
          </Tooltip>
        </div>
      ),
    },
  ];

  return <DataTable searchKey="products" columns={columns} data={data} />;
};
