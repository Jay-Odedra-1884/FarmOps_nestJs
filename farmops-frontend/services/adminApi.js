export const getAdminUsers = async (
  authToken,
  { search = "", status = "" } = {},
) => {
  const params = new URLSearchParams();
  if (search) params.append("search", search);
  if (status) params.append("status", status);

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/admin/users?${params.toString()}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    },
  );
  return response.json();
};

export const getAdminUser = async (authToken, id) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/admin/users/${id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    },
  );
  return response.json();
};

export const suspendAdminUser = async (authToken, id) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/admin/users/${id}/suspend`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    },
  );
  return response.json();
};

export const deleteAdminUser = async (authToken, id) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/admin/users/${id}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    },
  );
  return response.json();
};

export const getAdminStats = async (authToken) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/admin/stats`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    },
  );
  return response.json();
};
