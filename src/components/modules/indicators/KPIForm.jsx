// src/components/modules/indicators/KPIForm.jsx
import React, { useState } from 'react';
import { Form, Input, Select, DatePicker, Button, Card, Space, Alert, Table, InputNumber } from 'antd';
import { PlusOutlined, DeleteOutlined, SaveOutlined } from '@ant-design/icons';

const KPIForm = ({ kpi, onSubmit }) => {
  const [form] = Form.useForm();
  const [dataPoints, setDataPoints] = useState([]);

  const handleAddDataPoint = () => {
    setDataPoints([...dataPoints, { id: Date.now(), value: null, date: null }]);
  };

  const handleRemoveDataPoint = (id) => {
    setDataPoints(dataPoints.filter(dp => dp.id !== id));
  };

  const calculateKPI = (values) => {
    // Lógica de cálculo según la fórmula del KPI
    const sum = dataPoints.reduce((acc, dp) => acc + (dp.value || 0), 0);
    const average = dataPoints.length > 0 ? sum / dataPoints.length : 0;
    return average;
  };

  const handleSubmit = async (values) => {
    const kpiValue = calculateKPI(values);
    await onSubmit({ ...values, dataPoints, calculatedValue: kpiValue });
    form.resetFields();
    setDataPoints([]);
  };

  return (
    <Card title={`Registro de Datos - ${kpi?.name}`}>
      <Alert
        message="Instrucciones"
        description={`Fórmula de cálculo: ${kpi?.formula}. Frecuencia: ${kpi?.frequency}`}
        type="info"
        showIcon
        className="mb-4"
      />

      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          name="period"
          label="Período"
          rules={[{ required: true }]}
        >
          <Select>
            <Select.Option value="Enero 2024">Enero 2024</Select.Option>
            <Select.Option value="Febrero 2024">Febrero 2024</Select.Option>
            <Select.Option value="Marzo 2024">Marzo 2024</Select.Option>
          </Select>
        </Form.Item>

        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-semibold">Puntos de Datos</h4>
            <Button type="dashed" icon={<PlusOutlined />} onClick={handleAddDataPoint}>
              Agregar Dato
            </Button>
          </div>

          {dataPoints.map((point, index) => (
            <Card key={point.id} size="small" className="mb-2">
              <div className="grid grid-cols-2 gap-4">
                <InputNumber
                  placeholder="Valor"
                  className="w-full"
                  value={point.value}
                  onChange={(value) => {
                    const newPoints = [...dataPoints];
                    newPoints[index].value = value;
                    setDataPoints(newPoints);
                  }}
                />
                <DatePicker
                  placeholder="Fecha"
                  className="w-full"
                  onChange={(date) => {
                    const newPoints = [...dataPoints];
                    newPoints[index].date = date;
                    setDataPoints(newPoints);
                  }}
                />
                <Button icon={<DeleteOutlined />} danger onClick={() => handleRemoveDataPoint(point.id)} />
              </div>
            </Card>
          ))}
        </div>

        <Form.Item>
          <Button type="primary" htmlType="submit" icon={<SaveOutlined />} block>
            Guardar Datos y Calcular KPI
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default KPIForm;