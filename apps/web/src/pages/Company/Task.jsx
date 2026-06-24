import { insertTaskSchema, emailSchema } from "@repo/schemas";
import { Card, Form, Input } from "../../components";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";

function TaskForm({ setCreated }) {
  const { "*": wildcard } = useParams();
  const { t } = useTranslation("web");
  const ids = wildcard ? wildcard.split("/") : [];
  const parentId = ids.length > 0 ? ids[ids.length - 1] : null;

  const handleSubmit = (data) => {
    if (parentId) data.parentId = parentId; // Guardamos el enlace con su padre
    data.id = crypto.randomUUID();
    setCreated(data);
  };

  return (
    <>
      <Form schema={insertTaskSchema} handler={handleSubmit}>
        <h1>{t("create-task")}</h1>
        <Input name={"title"} />
        <Input name={"description"} />
        <Input name={"approxFinishDate"} type="date" />
        <Input name={"startedAt"} type="date" />
      </Form>
    </>
  );
}

export default function TaskDashboard() {
  const { id, "*": wildcard } = useParams();
  const { t } = useTranslation("web");

  const [tasks, setTasks] = useState([]);
  const [creating, setCreating] = useState(false);
  const [created, setCreated] = useState(null);
  const [deletedId, setDeletedId] = useState(null);
  const [associate, setAssociate] = useState(null);

  useEffect(() => {
    if (created) {
      setTasks([...tasks, created]);
      setCreated(null);
      setCreating(false);
    }
  }, [created, tasks]);

  useEffect(() => {
    if (deletedId) {
      setTasks((prev) => prev.filter((c) => c.id !== deletedId));
      setDeletedId(null);
    }
  }, [deletedId]);

  const currentIds = wildcard ? wildcard.split("/") : [];
  const currentParentId =
    currentIds.length > 0 ? currentIds[currentIds.length - 1] : null;
  const visibleTasks = tasks.filter((task) => {
    if (currentParentId) return task.parentId === currentParentId;
    return !task.parentId; // Muestra solo tareas raíz de la empresa
  });

  return (
    <>
      {creating && <TaskForm setCreated={setCreated} />}
      {associate && (
        <Form schema={emailSchema} handler={(data) => setAssociate(false)}>
          <Input name={"email"} />
        </Form>
      )}
      <header>
        <nav>
          <ul>
            <li>
              <button onClick={() => setCreating(true)}>{t("add")}</button>
            </li>
            {wildcard && (
              <li>
                <button onClick={() => setAssociate(true)}>
                  {t("associate")}
                </button>
              </li>
            )}
          </ul>
        </nav>
      </header>
      <main>
        {visibleTasks.length > 0 ? (
          <ul>
            {visibleTasks.map((c) => (
              <li key={c.id}>
                <Card id={c.id} setDeleted={setDeletedId}>
                  <Link to={wildcard ? `${wildcard}/${c.id}` : c.id}>
                    <h1>{c.title}</h1>
                    <ul>{c.description && <li>{c.description}</li>}</ul>
                  </Link>
                  <button onClick={() => setAssociate(true)}>{t("associate")}</button>
                </Card>
              </li>
            ))}
          </ul>
        ) : (
          <p>{t("no-tasks")}</p>
        )}
      </main>
    </>
  );
}
