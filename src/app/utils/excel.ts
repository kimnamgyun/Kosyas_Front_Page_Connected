import * as XLSX from 'xlsx';

export class Excel {
    /**
     * 엑셀 파일 내보내기
     * @param title : 파일명
     * @param items : 엑셀 자료
     */
    static exportToExcel(title: string, items: any): void {
        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(items);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, worksheet, title);
        XLSX.writeFile(wb, `${title}.xls`);
    }
}
