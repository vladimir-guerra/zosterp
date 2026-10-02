import { createContext, useContext, useState, useCallback, useMemo } from "react";

const AssociatesContext = createContext();

export const useAssociates = () => useContext(AssociatesContext);

const API_URL = `${import.meta.env.VITE_API_URL}/associates`;

export const AssociatesProvider = ({ children }) => {
  const [associates, setAssociates] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAssociates = useCallback(async (companyId) => {
    setIsLoading(true);
    setError(null);
    try {
      const url = companyId ? `${API_URL}/?companyId=${companyId}` : `${API_URL}/`;
      const response = await fetch(url, {
        method: "GET",
        credentials: "include",
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Error al obtener asociados");

      setAssociates(data.data || data.associates || []);
      if (data.currentUserId) {
        setCurrentUserId(data.currentUserId);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const inviteAssociate = useCallback(async (companyId, email) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/invitation/${companyId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Error al enviar invitación");

      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createAssociate = useCallback(async (companyId, userData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/workerInvitation/${companyId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Error al crear el asociado");

      await fetchAssociates();
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [fetchAssociates]);

  const updateAssociate = useCallback(async (companyId, userId, roleName) => {
    setError(null);
    try {
      const response = await fetch(`${API_URL}/${companyId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ userId, roleName }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Error al actualizar el rol");

      setAssociates((prev) =>
        prev.map((assoc) =>
          (assoc.userId || assoc.user_id) === userId
            ? {
              ...assoc,
              Role: { ...assoc.Role, name: roleName },
              User: assoc.User ? { ...assoc.User, Role: { ...assoc.User.Role, name: roleName } } : assoc.User
            }
            : assoc
        )
      );

      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const removeAssociate = useCallback(async (email) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/${email}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Error al eliminar asociado");

      setAssociates((prev) => prev.filter((assoc) => assoc.User?.email !== email));

      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const permissions = useMemo(() => {
    const myRecord = associates.find(
      (a) => (a.userId || a.User?.id) === currentUserId
    );
    const userRole = myRecord?.Role?.name || myRecord?.User?.Role?.name;

    const isOwner = userRole === "owner";
    const isAdminTask = userRole === "adminTask";
    const isAssociate = !isOwner && !isAdminTask;

    return {
      userRole,
      isOwner,
      isAdminTask,
      isAssociate,
      canManageTasks: isOwner || isAdminTask,
      canInviteAssociates: isOwner || isAdminTask,
      canManageAssociates: isOwner,
    };
  }, [associates, currentUserId]);

  const contextValue = useMemo(
    () => ({
      associates,
      isLoading,
      error,
      ...permissions,
      fetchAssociates,
      inviteAssociate,
      createAssociate,
      updateAssociate,
      removeAssociate,
    }),
    [
      associates,
      isLoading,
      error,
      permissions,
      fetchAssociates,
      inviteAssociate,
      createAssociate,
      updateAssociate,
      removeAssociate,
    ]
  );

  return (
    <AssociatesContext.Provider value={contextValue}>
      {children}
    </AssociatesContext.Provider>
  );
};