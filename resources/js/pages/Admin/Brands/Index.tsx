import { usePage, router } from "@inertiajs/react";
import DataTable from "@/components/DataTables/DataTables";
import AppLayout from "@/layouts/app-layout";
import { FolderKanban } from "lucide-react"; // Icon for categories

export default function BrandsIndex() {
  const { brands, filters, can } = usePage().props;

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
    {
      key: 'slug',
      label: 'Slug',
      sortable: true,
      type: 'text',
    },
    {
      key: 'description',
      label: 'Description',
      sortable: true,
      type: 'text',
    },
    
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      type: 'text',
      render: (item: any) => (
        <span className={item.status === '0' ? 'text-green-600' : 'text-red-500'}>
          {item.status === '0' ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      key: 'image',
      label: 'Image',
      sortable: false,
      width: '50px',
      render: (item: any) => {
        return item.image ? (
          <img
            src={item.image}
            alt={`${item.name} image`}
            className="h-10 w-10 rounded-full object-cover"
          />
        ) : (
          <span className="text-gray-400">No image</span>
        );
      },
    },
    {
      key: 'created_at',
      label: 'Created At',
      sortable: true,
      type: 'date2',
    },
  ];

  const handleDelete = (id: string) => {
    router.delete(route('admin.brands.destroy', id), {
      preserveScroll: true,
    });
  };

  return (
    <AppLayout title="Brands">
      <div className="py-6">
        <div className="mx-auto">
          <DataTable
            data={brands}
            columns={columns}
            resourceName="Brands"
            singularName="Brand"
            routeName="admin.brands.index"
            filters={filters}
            canViewResource={false}
            canCreateResource={can.create}
            canEditResource={can.edit}
            canDeleteResource={can.delete}
            viewRoute="admin.brands.show"
            createRoute="admin.brands.create"
            editRoute="admin.brands.edit"
            onDelete={handleDelete}
            icon={FolderKanban}
          />
        </div>
      </div>
    </AppLayout>
  );
}
