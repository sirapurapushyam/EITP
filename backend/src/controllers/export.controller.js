import PDFDocument from 'pdfkit';
import ExcelJS from 'exceljs';
import { EventRegistration } from '../models/eventRegistration.model.js';
import { JobApplication } from '../models/jobApplication.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
export const exportEventPdf = asyncHandler(async (req, res) => {

  const registrations =
    await EventRegistration.find({
      event: req.params.id
    }).populate(
      'student',
      'name studentId branch phone campus'
    );

  const doc = new PDFDocument();

  res.setHeader(
    'Content-Type',
    'application/pdf'
  );
  
  res.setHeader(
    'Content-Disposition',
    'attachment; filename=event-registrations.pdf'
  );

  doc.pipe(res);

  doc.fontSize(18)
    .text('Event Registration List');

  doc.moveDown();

  registrations.forEach((r, i) => {

    doc.text(
      `${i + 1}. ${r.student.name}
Student ID: ${r.student.studentId}
Branch: ${r.student.branch}
Phone: ${r.student.phone}
Campus: ${r.student.campus}
Attendance: ${r.attendanceStatus}

`
    );

  });

  doc.end();

});
export const exportEventExcel =
asyncHandler(async (req, res) => {

  const registrations =
    await EventRegistration.find({
      event: req.params.id
    }).populate(
      'student',
      'name studentId branch phone campus'
    );

  const workbook =
    new ExcelJS.Workbook();

  const sheet =
    workbook.addWorksheet(
      'Registrations'
    );

  sheet.columns = [
    {
      header: 'Name',
      key: 'name'
    },
    {
      header: 'Student ID',
      key: 'studentId'
    },
    {
      header: 'Branch',
      key: 'branch'
    },
    {
      header: 'Phone',
      key: 'phone'
    },
    {
      header: 'Campus',
      key: 'campus'
    },
    {
      header: 'Attendance',
      key: 'attendance'
    }
  ];

  registrations.forEach(r => {

    sheet.addRow({
      name: r.student.name,
      studentId: r.student.studentId,
      branch: r.student.branch,
      phone: r.student.phone,
      campus: r.student.campus,
      attendance:
        r.attendanceStatus
    });

  });

  res.setHeader(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  );

  res.setHeader(
    'Content-Disposition',
    'attachment; filename=event-registrations.xlsx'
  );

  await workbook.xlsx.write(res);

  res.end();

});
export const exportJobPdf = asyncHandler(async (req, res) => {

  const applications = await JobApplication.find({
    job: req.params.id
  }).populate(
    'student',
    'name studentId branch phone campus'
  );

  const doc = new PDFDocument();

  res.setHeader(
    'Content-Type',
    'application/pdf'
  );

  res.setHeader(
    'Content-Disposition',
    'attachment; filename=job-applications.pdf'
  );

  doc.pipe(res);

  doc.fontSize(18)
    .text('Job Applications');

  doc.moveDown();

  applications.forEach((a, i) => {

    doc.text(
`${i + 1}. ${a.student.name}
Student ID: ${a.student.studentId}
Branch: ${a.student.branch}
Phone: ${a.student.phone}
Campus: ${a.student.campus}
Status: ${a.status}
Attendance: ${a.attendanceStatus}

`
    );

  });

  doc.end();

});
export const exportJobExcel = asyncHandler(async (req, res) => {

  const applications = await JobApplication.find({
    job: req.params.id
  }).populate(
    'student',
    'name studentId branch phone campus'
  );

  const workbook = new ExcelJS.Workbook();

  const sheet = workbook.addWorksheet(
    'Applications'
  );

  sheet.columns = [
    {
      header: 'Name',
      key: 'name'
    },
    {
      header: 'Student ID',
      key: 'studentId'
    },
    {
      header: 'Branch',
      key: 'branch'
    },
    {
      header: 'Phone',
      key: 'phone'
    },
    {
      header: 'Campus',
      key: 'campus'
    },
    {
      header: 'Status',
      key: 'status'
    },
    {
      header: 'Attendance',
      key: 'attendance'
    }
  ];

  applications.forEach(a => {

    sheet.addRow({
      name: a.student.name,
      studentId: a.student.studentId,
      branch: a.student.branch,
      phone: a.student.phone,
      campus: a.student.campus,
      status: a.status,
      attendance: a.attendanceStatus
    });

  });

  res.setHeader(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  );

  res.setHeader(
    'Content-Disposition',
    'attachment; filename=job-applications.xlsx'
  );

  await workbook.xlsx.write(res);

  res.end();

});
