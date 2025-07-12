import { usePage, router } from "@inertiajs/react";
import DataTable from "@/components/DataTables/DataTables";
import AppLayout from "@/layouts/app-layout";

import { User } from "lucide-react"; // icon

export default function UserIndex() {
  const { users, filters, can } = usePage().props;

  const columns = [
    {
      key: 'index',
      label: '#',
      sortable: false,
      type: 'IndexColum',
      width: '80px',
      render: (_item: any, index: number) => {
        return (filters.page - 1) * filters.perPage + (index + 1);
      },
    },
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      type: 'text',
    },
    {
      key: 'username',
      label: 'Username',
      sortable: true,
      type: 'text',
    },
    {
      key: 'email',
      label: 'Email',
      sortable: true,
      type: 'text',
    },
    {
      key: 'phone',
      label: 'Phone',
      sortable: true,
      type: 'text',
    },
    {
      key: 'address',
      label: 'Address',
      sortable: true,
      type: 'text',
    },
    {
      key: 'created_at',
      label: 'Created At',
      sortable: true,
      type: 'date2',
    },
  ];

const handleDelete = (id: string) => {
  router.delete(route('admin.users.destroy', id), {
    preserveScroll: true,
    onSuccess: () => {
     // toast.success('User deleted successfully');
    },
    onError: () => {
      //toast.error('User deletion failed');
    },
  });
};

  return (
    <AppLayout title="Users">
    
        <div className="py-6">
            <div className="mx-auto">
                <DataTable
                    data={users}
                    columns={columns}
                    resourceName="Users"
                    singularName="User"
                    routeName="admin.users.index"
                    filters={filters}
                    canViewResource={false}
                    canCreateResource={false}
                    canEditResource={false}
                    canDeleteResource={false}
                    viewRoute='admin.users.show'
                    createRoute='admin.users.create'
                    editRoute='admin.users.edit'
                    onDelete={handleDelete}
                    icon={User}
                    
                />

            </div>
        </div>
      
    </AppLayout>
  );
}
