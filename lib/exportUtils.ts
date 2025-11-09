
import { Report, GeneralEvaluationReport, ClassSessionEvaluationReport, Teacher } from '../types';

declare const jspdf: any;
declare const XLSX: any;

const getScorePercentage = (score: number, maxScore: number = 4) => {
    if (maxScore === 0) return 0;
    return (score / maxScore) * 100;
};

const calculateReportPercentage = (report: Report): number => {
    let allScores: number[] = [];
    let maxScorePerItem = 4;

    if(report.evaluationType === 'general') {
        allScores = (report as GeneralEvaluationReport).criteria.map(c => c.score);
    } else if (report.evaluationType === 'class_session') {
        allScores = (report as ClassSessionEvaluationReport).criterionGroups.flatMap(g => g.criteria).map(c => c.score);
    }
    
    if (allScores.length === 0) return 0;
    const totalScore = allScores.reduce((sum, score) => sum + score, 0);
    const maxPossibleScore = allScores.length * maxScorePerItem;
    return (totalScore / maxPossibleScore) * 100;
};


const generateTextContent = (report: Report, teacher: Teacher): string => {
    let content = `تقرير لـ: ${teacher.name}\n`;
    content += `تاريخ: ${new Date(report.date).toLocaleDateString()}\n`;
    content += `المدرسة: ${report.school}\nالمادة: ${report.subject}\nالصفوف: ${report.grades}\nالفرع: ${report.branch}\n`;

    if (report.evaluationType === 'general') {
        const generalReport = report as GeneralEvaluationReport;
        content += "\n--- تقييم عام ---\n";
        generalReport.criteria.forEach(c => {
            content += `${c.label}: ${c.score} / 4 (${getScorePercentage(c.score, 4).toFixed(0)}%)\n`;
        });
        content += `\nالنسبة المئوية النهائية: ${calculateReportPercentage(generalReport).toFixed(2)}%\n\n`;
        content += `أهم الاستراتيجيات المنفذة: ${generalReport.strategies}\n`;
        content += `أهم الوسائل المستخدمة: ${generalReport.tools}\n`;
        content += `أهم البرامج المنفذة: ${generalReport.programs}\n`;

    } else if (report.evaluationType === 'class_session') {
        const classReport = report as ClassSessionEvaluationReport;
        content += `\n--- تقييم حصة دراسية (${classReport.subType}) ---\n`;
        content += `اسم المشرف: ${classReport.supervisorName}\n`;
        content += `الفصل الدراسي: ${classReport.semester}\n`;
        content += `نوع الزيارة: ${classReport.visitType}\n`;
        content += `الصف: ${classReport.class} / ${classReport.section}\n`;
        content += `عنوان الدرس: ${classReport.lessonName}\n\n`;

        classReport.criterionGroups.forEach(group => {
            content += `\n${group.title}:\n`;
            group.criteria.forEach(c => {
                content += `  - ${c.label}: ${c.score} / 4 (${getScorePercentage(c.score, 4).toFixed(0)}%)\n`;
            });
        });
        content += `\nالنسبة المئوية النهائية: ${calculateReportPercentage(classReport).toFixed(2)}%\n\n`;
        content += `الإيجابيات: ${classReport.positives}\n`;
        content += `ملاحظات للتحسين: ${classReport.notesForImprovement}\n`;
        content += `التوصيات: ${classReport.recommendations}\n`;
        content += `تعليق الموظف: ${classReport.employeeComment}\n`;
    }

    return content;
};

// --- SINGLE REPORT EXPORT ---

export const exportToTxt = (report: Report, teacher: Teacher) => {
    const content = generateTextContent(report, teacher);
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `report_${teacher.name}_${report.date}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

const setupPdfDoc = () => {
    const { jsPDF } = jspdf;
    const doc = new jsPDF();
    doc.addFont('https://fonts.gstatic.com/s/amiri/v25/J7aRnpd8CGxBHqU2sQ.woff2', 'Amiri', 'normal');
    doc.setFont('Amiri');
    return doc;
}

const rtl = (text: string) => text.split(' ').reverse().join(' ');

const generatePdfForReport = (doc: any, report: Report, teacher: Teacher, startY: number) => {
    let y = startY;
    const writeRtl = (text: string, yPos: number) => doc.text(rtl(text), 200, yPos, { align: 'right' });

    writeRtl(`تقرير لـ: ${teacher.name}`, y); y += 7;
    writeRtl(`تاريخ: ${new Date(report.date).toLocaleDateString()}`, y); y += 7;
    writeRtl(`المدرسة: ${report.school} | المادة: ${report.subject} | الصفوف: ${report.grades} | الفرع: ${report.branch}`, y); y+= 10;
    
    const tableStyles = { font: 'Amiri', halign: 'right', cellPadding: 2 };
    const headStyles = { halign: 'right', fillColor: [22, 120, 109], textColor: 255 };

    if (report.evaluationType === 'general') {
        const r = report as GeneralEvaluationReport;
        doc.autoTable({
            startY: y,
            head: [[rtl('النسبة'), rtl('الدرجة'), rtl('المعيار')]],
            body: r.criteria.map(c => [`%${getScorePercentage(c.score, 4).toFixed(0)}`, c.score, rtl(c.label)]),
            styles: tableStyles, headStyles
        });
        y = doc.lastAutoTable.finalY + 10;
        writeRtl(`النسبة النهائية: ${calculateReportPercentage(r).toFixed(2)}%`, y); y+=10;
        doc.text(rtl(`أهم الاستراتيجيات المنفذة: ${r.strategies}`), 200, y, { align: 'right', maxWidth: 180 }); y += 15;
        doc.text(rtl(`أهم الوسائل المستخدمة: ${r.tools}`), 200, y, { align: 'right', maxWidth: 180 }); y += 15;
        doc.text(rtl(`أهم البرامج المنفذة: ${r.programs}`), 200, y, { align: 'right', maxWidth: 180 }); y += 10;

    } else if (report.evaluationType === 'class_session') {
        const r = report as ClassSessionEvaluationReport;
        r.criterionGroups.forEach(group => {
            doc.autoTable({
                startY: y,
                head: [[rtl(group.title)]],
                body: group.criteria.map(c => [rtl(c.label), c.score]),
                styles: tableStyles, headStyles: {...headStyles, fillColor: [75, 85, 99]},
                didParseCell: (data:any) => { data.cell.styles.halign = data.column.index === 1 ? 'center' : 'right' }
            });
            y = doc.lastAutoTable.finalY + 5;
        });
        y+=5;
        writeRtl(`النسبة النهائية: ${calculateReportPercentage(r).toFixed(2)}%`, y); y+=10;
    }
    return doc.lastAutoTable.finalY + 20;
}


export const exportToPdf = (report: Report, teacher: Teacher) => {
    const doc = setupPdfDoc();
    generatePdfForReport(doc, report, teacher, 20);
    doc.save(`report_${teacher.name}_${report.date}.pdf`);
};

export const exportToExcel = (report: Report, teacher: Teacher) => {
    const data: any[] = [];
    data.push(["المعلم", teacher.name]);
    data.push(["التاريخ", new Date(report.date).toLocaleDateString()]);
    data.push(["المدرسة", report.school]);
    data.push(["المادة", report.subject]);
    data.push(["الصفوف", report.grades]);
    data.push(["الفرع", report.branch]);
    data.push([]); // Spacer

    if (report.evaluationType === 'general') {
        const r = report as GeneralEvaluationReport;
        data.push(["نوع التقييم", "تقييم عام"]);
        data.push([]);
        data.push(["المعيار", "الدرجة", "النسبة"]);
        r.criteria.forEach(c => {
            data.push([c.label, c.score, `${getScorePercentage(c.score, 4).toFixed(0)}%`]);
        });
        data.push([]);
        data.push(["النسبة النهائية", `${calculateReportPercentage(r).toFixed(2)}%`]);
        data.push([]);
        data.push(["الاستراتيجيات", r.strategies]);
        data.push(["الوسائل", r.tools]);
        data.push(["البرامج", r.programs]);
        data.push(["المصادر", r.sources]);
    } else if (report.evaluationType === 'class_session') {
        const r = report as ClassSessionEvaluationReport;
        data.push(["نوع التقييم", `تقييم حصة دراسية (${r.subType})`]);
        data.push(["اسم المشرف", r.supervisorName], ["الفصل الدراسي", r.semester], ["نوع الزيارة", r.visitType], ["الصف", `${r.class} / ${r.section}`], ["عنوان الدرس", r.lessonName]);
        data.push([]);
         r.criterionGroups.forEach(group => {
            data.push([group.title, "الدرجة"]);
            group.criteria.forEach(c => {
                data.push([`  - ${c.label}`, c.score]);
            });
        });
        data.push([]);
        data.push(["النسبة النهائية", `${calculateReportPercentage(r).toFixed(2)}%`]);
        data.push([]);
        data.push(["الإيجابيات", r.positives]);
        data.push(["ملاحظات للتحسين", r.notesForImprovement]);
        data.push(["التوصيات", r.recommendations]);
        data.push(["تعليق الموظف", r.employeeComment]);
    }

    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Report");
    XLSX.writeFile(wb, `report_${teacher.name}_${report.date}.xlsx`);
};


export const sendToWhatsApp = (report: Report, teacher: Teacher) => {
    const content = generateTextContent(report, teacher);
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(content)}`;
    window.open(whatsappUrl, '_blank');
};

// --- AGGREGATED REPORTS EXPORT ---

const generateAggregatedText = (reports: Report[], teachers: Teacher[]): string => {
    const teacherMap = new Map(teachers.map(t => [t.id, t]));
    let fullContent = "--- تقارير مجمعة ---\n\n";
    reports.forEach(report => {
        const teacher = teacherMap.get(report.teacherId);
        if (teacher) {
            fullContent += generateTextContent(report, teacher);
            fullContent += "\n================================\n\n";
        }
    });
    return fullContent;
}

export const exportAggregatedToTxt = (reports: Report[], teachers: Teacher[]) => {
    const content = generateAggregatedText(reports, teachers);
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `aggregated_reports_${new Date().toISOString().split('T')[0]}.txt`;
    link.click();
};

export const exportAggregatedToPdf = (reports: Report[], teachers: Teacher[]) => {
    const doc = setupPdfDoc();
    const teacherMap = new Map(teachers.map(t => [t.id, t]));
    let y = 20;

    reports.forEach((report, index) => {
        const teacher = teacherMap.get(report.teacherId);
        if (teacher) {
            if (index > 0) {
                doc.addPage();
                y = 20;
            }
            generatePdfForReport(doc, report, teacher, y);
        }
    });

    doc.save(`aggregated_reports_${new Date().toISOString().split('T')[0]}.pdf`);
};

export const exportAggregatedToExcel = (reports: Report[], teachers: Teacher[]) => {
    const teacherMap = new Map(teachers.map(t => [t.id, t.name]));
    const data = reports.map(r => ({
        "المعلم": teacherMap.get(r.teacherId) || 'غير معروف',
        "التاريخ": new Date(r.date).toLocaleDateString(),
        "المدرسة": r.school,
        "نوع التقييم": r.evaluationType === 'general' ? 'عام' : 'حصة دراسية',
        "النسبة المئوية": calculateReportPercentage(r).toFixed(2) + '%'
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Aggregated Reports");
    XLSX.writeFile(wb, `aggregated_reports_${new Date().toISOString().split('T')[0]}.xlsx`);
};

export const sendAggregatedToWhatsApp = (reports: Report[], teachers: Teacher[]) => {
    const content = generateAggregatedText(reports, teachers);
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(content)}`;
    window.open(whatsappUrl, '_blank');
};