"use client";

import { ICheckJobDay } from "@/app/shared/model/check-job-day.model";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { useAppDispatch, useAppSelector } from "@/store";
import { ColumnDef } from "@tanstack/react-table";
import { Logs, Printer } from "lucide-react";
import { CircuitBoard } from "lucide-react";
import Link from "next/link";
import { Tooltip } from "@nextui-org/react";
import TaskPopup from "./TaskPopup";

import {
  downloadEntity,
  partialUpdateEntity,
} from "@/app/shared/reducers/entities/check-job-day.reducer";
import { useEffect, useRef, useState } from "react";
import { remotebuildexecution } from "googleapis/build/src/apis/remotebuildexecution";

import { defaultValue } from "@/app/shared/model/check-job-day.model";
import { ICheckJobLog } from "@/app/shared/model/check-job-log.model";

export const CheckJobDaysTable: React.FC<{ data: ICheckJobDay[] }> = ({
  data,
}) => {
  const [popupOpen, setPopupOpen] = useState(false);

  const trigger = useRef<any>(null);
  const popup = useRef<any>(null);

  const [checkJobLogs, setCheckJobLogs] = useState<ICheckJobLog[]>([]);

  const dispatch = useAppDispatch();

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!popup.current) return;
      if (
        !popupOpen ||
        popup.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setPopupOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!popupOpen || keyCode !== 27) return;
      setPopupOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  const triggerDownload = (blob: Blob, filename: string) => {
    const url = window.URL.createObjectURL(new Blob([blob]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename); // Specify the file name
    document.body.appendChild(link);
    link.click();
    link.remove();
  };
  // const viewLogs = (popupOpen: boolean, checkDayJobId: number) => {
  //   setPopupOpen(!popupOpen);
  //   console.info(checkDayJobId);
  // };

  const reBuild = (id: number, day: string) => {
    const entity = {
      ...defaultValue,
      id: id,
    };
    dispatch(partialUpdateEntity(entity));
  };

  const handleDownload = async (
    id: number,
    day: string,
    resultFileName: string,
  ) => {
    const resultAction = await dispatch(downloadEntity({ id, day }));
    if (downloadEntity.fulfilled.match(resultAction)) {
      const blob = resultAction.payload;
      triggerDownload(blob, resultFileName);
    } else {
      console.error("Download failed:", resultAction.payload);
    }
  };

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
        return row?.original?.checkJob?.jobName;
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
      header: "文件总数",
      cell: ({ row }) => {
        return (
          <Tooltip
            content="查看转换日志"
            placement="top"
            className="rounded-lg bg-gray-300 p-2  text-sm  text-black shadow-lg transition-opacity duration-300"
          >
            <a
              className="text-blue-600 underline hover:text-blue-800"
              ref={trigger}
              onClick={() => {
                setPopupOpen(!popupOpen);
                setCheckJobLogs(row.original.checkJobLogs as ICheckJobLog[]);
              }}
            >
              {row.original.num}
            </a>
          </Tooltip>
        );
      },
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
                  row.original.id ?? 0,
                  row.original.day ?? "",
                  row.original.resultFileName ?? "",
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
      cell: ({ row }) => {
        // 假设我们要根据 row.original.status 来决定是否显示 Tooltip
        const num = row.original.num ?? 0;
        const showTooltip = row.original.jobStatus == "COMPLETED" && num > 0;

        return (
          <div className="flex gap-1">
            {showTooltip ? (
              <Tooltip
                content="预览打印"
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
            ) : (
              <></>
            )}

            <Tooltip
              content="重新生成"
              placement="top"
              className="rounded-lg bg-gray-300 p-2  text-sm  text-black shadow-lg transition-opacity duration-300"
            >
              <Button
                size="icon"
                variant="outline"
                onClick={() => {
                  reBuild(row.original.id ?? 0, row.original.day ?? "");
                }}
              >
                <CircuitBoard className="h-4" />
              </Button>
            </Tooltip>

            <Tooltip
              content="查看解析日志"
              placement="top"
              className="rounded-lg bg-gray-300 p-2  text-sm  text-black shadow-lg transition-opacity duration-300"
            >
              <Button
                size="icon"
                variant="outline"
                ref={trigger}
                onClick={() => {
                  setPopupOpen(!popupOpen);
                  setCheckJobLogs(row.original.checkJobLogs as ICheckJobLog[]);
                }}
              >
                <Logs className="h-4" />
              </Button>
            </Tooltip>
          </div>
        );
      },
    },
  ];

  return (
    <>
      <DataTable searchKey="products" columns={columns} data={data} />;
      {/* <!-- ===== Task Popup Start ===== --> */}
      <TaskPopup
        popupOpen={popupOpen}
        checkJobLogs={checkJobLogs}
        setPopupOpen={setPopupOpen}
      />
      {/* <!-- ===== Task Popup End ===== --> */}
    </>
  );
};
