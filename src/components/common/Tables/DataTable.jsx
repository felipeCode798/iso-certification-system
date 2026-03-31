// src/components/common/Tables/DataTable.jsx
import React, { useState } from 'react';
import { Table, Input, Button, Space, Select, DatePicker, Tag } from 'antd';
import { SearchOutlined, ReloadOutlined, DownloadOutlined, FilterOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx';

const { RangePicker } = DatePicker;

const DataTable = ({ 
  columns, 
  dataSource, 
  loading, 
  onSearch, 
  onExport, 
  onRefresh,
  title,
  rowKey = 'id',
  pagination = { pageSize: 10, showSizeChanger: true, showTotal: (total) => `Total ${total} registros` }
}) => {
  const [searchText, setSearchText] = useState('');
  const [filteredData, setFilteredData] = useState(dataSource);

  const handleSearch = (value) => {
    setSearchText(value);
    if (onSearch) {
      onSearch(value);
    } else {
      const filtered = dataSource.filter(item =>
        Object.values(item).some(val =>
          String(val).toLowerCase().includes(value.toLowerCase())
        )
      );
      setFilteredData(filtered);
    }
  };

  const handleExport = () => {
    const exportData = filteredData || dataSource;
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Datos');
    XLSX.writeFile(workbook, `${title || 'export'}_${new Date().toISOString()}.xlsx`);
  };

  return (
    <div className="data-table">
      <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <Space wrap>
          <Input
            placeholder="Buscar..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-64"
            allowClear
          />
          <Button icon={<ReloadOutlined />} onClick={onRefresh}>
            Actualizar
          </Button>
          <Button icon={<DownloadOutlined />} onClick={handleExport}>
            Exportar
          </Button>
        </Space>
      </div>
      
      <Table
        columns={columns}
        dataSource={onSearch ? dataSource : filteredData}
        loading={loading}
        rowKey={rowKey}
        pagination={pagination}
        scroll={{ x: true }}
      />
    </div>
  );
};

export default DataTable;