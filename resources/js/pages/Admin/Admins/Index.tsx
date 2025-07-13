import { usePage, router } from "@inertiajs/react";
import DataTable from "@/components/DataTables/DataTables";
import AppLayout from "@/layouts/app-layout";

import { User } from "lucide-react"; // icon

export default function AdminsIndex() {
  const { admins, filters, can } = usePage().props;

  const columns = [
    {
      key: 'index',
      label: '#',
      sortable: false,
      type: 'IndexColum',
      width: '50px',
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
    // {
    //   key: 'username',
    //   label: 'Username',
    //   sortable: true,
    //   type: 'text',
    // },
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
  key: 'avatar',
  label: 'Avatar',
  sortable: false,
  width: '50px',
  height: '50px',
  render: (item: any) => {
    return item.avatar ? (
      <img
        src={item.avatar}
        alt={`${item.name} avatar`}
        className="h-10 w-10 rounded-full object-cover"
      />
    ) : (
      <span className="text-gray-400">No avatar</span>
    );
  }
}
,
    {
      key: 'created_at',
      label: 'Created At',
      sortable: true,
      type: 'date2',
    },
  ];

const handleDelete = (id: string) => {
  router.delete(route('admin.admins.destroy', id), {
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
    <AppLayout title="Admins">
    
        <div className="py-6">
            <div className="mx-auto">
                <DataTable
                    data={admins}
                    columns={columns}
                    resourceName="Admins"
                    singularName="Admin"
                    routeName="admin.admins.index"
                    filters={filters}
                    canViewResource={false}
                    canCreateResource={true}
                    canEditResource={true}
                    canDeleteResource={true}
                    viewRoute='admin.admins.show'
                    createRoute='admin.admins.create'
                    editRoute='admin.admins.edit'
                    onDelete={handleDelete}
                    icon={User}
                    
                />

            </div>
        </div>
      
    </AppLayout>
  );
}