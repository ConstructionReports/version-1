# Construction Reports

Small-team construction management: Job Trackers, employee profiles, Excel import/export, and e-signature infrastructure.

The marketing site explains the product. The app ships with three Southwest jobs, eight people, and three managers so you can file trackers, assign profiles, leave notes, sign, and move the same columns through Excel. Data stays in `localStorage` until you reset the demo.

## Scripts

```bash
npm install
npm run dev      # http://localhost:5173
npm test
npm run build
npm run preview
```

## App routes

- `/` marketing site
- `/app` Job Trackers
- `/app/trackers/new` file a tracker
- `/app/trackers/:id` printable tracker + manager notes
- `/app/people` employee profiles
- `/app/import-export` Excel export, template, import, column map

## Excel sheets

`jobs`, `employees`, `daily_logs`, `crew` — stable snake_case headers (`job_number`, `log_date`, `work_completed`, `assigned_employee_numbers`, …). Import upserts on those keys.
