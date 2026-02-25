
import React from 'react';
import { DashboardLayout } from '../../../components/dashboard/NeuronDashboardComponents';

const SystemStatusPage: React.FC = () => {
  return (
    <DashboardLayout 
      title="系统状态"
      description="监控系统运行状态和性能指标"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {/* 系统性能图表 */}
          <div className="bg-white dark:bg-card rounded-lg shadow-sm border border-border p-4 mb-4">
            <h2 className="text-lg font-semibold mb-4">系统性能监控</h2>
            <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-secondary/20 rounded border border-dashed border-border text-muted-foreground">
              CPU/内存使用率图表
            </div>
          </div>
          
          {/* 服务状态 */}
          <div className="bg-white dark:bg-card rounded-lg shadow-sm border border-border p-4">
            <h2 className="text-lg font-semibold mb-4">服务状态</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border border-border rounded">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                  <span>数据库服务</span>
                </div>
                <span className="text-sm text-muted-foreground">运行中</span>
              </div>
              <div className="flex items-center justify-between p-3 border border-border rounded">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                  <span>API服务</span>
                </div>
                <span className="text-sm text-muted-foreground">运行中</span>
              </div>
              <div className="flex items-center justify-between p-3 border border-border rounded">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                  <span>文件存储服务</span>
                </div>
                <span className="text-sm text-muted-foreground">运行中</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          {/* 快速统计 */}
          <div className="bg-white dark:bg-card rounded-lg shadow-sm border border-border p-4">
            <h2 className="text-lg font-semibold mb-4">系统统计</h2>
            <div className="space-y-3">
              <div className="flex justify-between border-b border-border/50 pb-2">
                <span className="text-muted-foreground">总用户数</span>
                <span className="font-semibold">1,234</span>
              </div>
              <div className="flex justify-between border-b border-border/50 pb-2">
                <span className="text-muted-foreground">今日活跃</span>
                <span className="font-semibold">89</span>
              </div>
              <div className="flex justify-between border-b border-border/50 pb-2">
                <span className="text-muted-foreground">存储使用</span>
                <span className="font-semibold">2.4 GB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">API请求</span>
                <span className="font-semibold">12,456</span>
              </div>
            </div>
          </div>
          
          {/* 系统信息 */}
          <div className="bg-white dark:bg-card rounded-lg shadow-sm border border-border p-4">
            <h2 className="text-lg font-semibold mb-4">系统信息</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">版本</span>
                <span>v2.1.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">启动时间</span>
                <span>2024-01-15 08:30</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">运行时长</span>
                <span>15天 4小时</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">最后备份</span>
                <span>2024-01-14 23:00</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SystemStatusPage;
