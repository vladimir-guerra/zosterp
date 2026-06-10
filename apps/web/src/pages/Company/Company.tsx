import { useState } from "react";
import {
  insertCompanySchema,
  type CompanyOutput,
  type InsertCompanyInput,
} from "@repo/schemas";
import { Form, Input } from "../../components";
import { Link } from "react-router-dom";

export function CreateCompany({ onAdd }: { onAdd: (data: any) => void }) {
  const handleSend = (data: any) => {
    onAdd(data); // Agregamos al estado global
  };

  return (
    <Form
      title="create-company"
      schema={insertCompanySchema}
      handler={handleSend}
      Elements={[
        <Input key="socialReason" name="socialReason" />,
        <Input key="commercialName" name="commercialName" />,
        <Input key="industry" name="industry" />,
        <Input key="country" name="country" maxLength={3} minLength={3} />,
        <Input key="email" name="email" />,
      ]}
    />
  );
}

export default function Company() {
  const [creating, setCreating] = useState<boolean>(false);
  const [companies, setCompanies] = useState<CompanyOutput[]>([]);

  const addCompany = (newCompany: InsertCompanyInput) => {
    const companyWithId: CompanyOutput = {
      ...newCompany,
      id: crypto.randomUUID(), // Genera un ID único (estándar en navegadores modernos)
    };
    setCompanies([...companies, companyWithId]);
    setCreating(false);
  };

  return (
    <div>
      {creating ? (
        <CreateCompany onAdd={addCompany} />
      ) : (
        <ul>
          {companies.map((c, index) => (
            <li>
              <Link to={`/erp/${c.id}`} key={index}>
                {c.commercialName} - {c.socialReason}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
