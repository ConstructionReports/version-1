import { EmployeeForm } from "../components/EmployeeForm";

export function NewEmployeePage() {
  return (
    <div>
      <div className="page-head">
        <div>
          <p className="kicker">New profile</p>
          <h2>Add an employee</h2>
        </div>
      </div>
      <EmployeeForm />
    </div>
  );
}
