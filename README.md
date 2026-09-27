# Construction Reports

Version 1 of the Construction Reports website: a field-ready daily jobsite log for superintendents.

The marketing site explains the product. The app ships with three Southwest sample jobs so you can file, search, edit, print, and delete daily reports in the browser. Reports persist in `localStorage` until you reset the demo.

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
- `/app` job board
- `/app/reports` full log + search
- `/app/reports/new` file a daily
- `/app/projects/:id` one job
- `/app/reports/:id` printable report
