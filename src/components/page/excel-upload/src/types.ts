export type ExcelData = { results: any; header: string[] };

export interface UploadExcelProps {
  /** 是否显示拖拽区域。`boolean` 类型，默认为 `false` */
  drag?: boolean;
  /** 上传前回调。`(file: File) => boolean` 类型 */
  beforeUpload?: (file: File) => boolean;
  /** 上传成功回调。`(excelData: ExcelData) => void` 类型 */
  onSuccess: (excelData: ExcelData) => void;
}
