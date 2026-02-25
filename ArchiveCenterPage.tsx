
import React from 'react';
import { DashboardLayout } from '../../../components/dashboard/NeuronDashboardComponents';

const ArchiveCenterPage: React.FC = () => {
  return (
    <DashboardLayout 
      title="归档中心"
      description="管理系统数据归档和历史记录"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {/* 归档统计 */}
          <div className="bg-white dark:bg-card rounded-lg shadow-sm border border-border p-4 mb-4">
            <h2 className="text-lg font-semibold mb-4">归档统计</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-100 dark:border-blue-900/50">
                <div className="text-sm text-blue-600 dark:text-blue-400">已归档项目</div>
                <div className="text-2xl font-bold text-foreground">2,345</div>
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded border border-green-100 dark:border-green-900/50">
                <div className="text-sm text-green-600 dark:text-green-400">归档空间</div>
                <div className="text-2xl font-bold text-foreground">1.2 GB</div>
              </div>
            </div>
          </div>
          
          {/* 归档历史 */}
          <div className="bg-white dark:bg-card rounded-lg shadow-sm border border-border p-4">
            <h2 className="text-lg font-semibold mb-4">最近归档</h2>
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="flex items-center justify-between p-3 border border-border rounded hover:bg-secondary/30 transition-colors">
                  <div>
                    <div className="font-medium">归档项目 {i}</div>
                    <div className="text-sm text-muted-foreground">2024-01-{15-i} 归档</div>
                  </div>
                  <span className="text-xs px-2 py-1 bg-secondary rounded-full border border-border">
                    {['任务', '笔记', '项目', '客户', '资源'][i-1]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          {/* 归档设置 */}
          <div className="bg-white dark:bg-card rounded-lg shadow-sm border border-border p-4">
            <h2 className="text-lg font-semibold mb-4">归档设置</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">自动归档</span>
                <div className="relative inline-block w-10 align-middle select-none">
                  <input type="checkbox" defaultChecked className="sr-only peer" id="auto-archive" />
                  <label htmlFor="auto-archive" className="block h-6 bg-gray-300 peer-checked:bg-green-500 rounded-full cursor-pointer transition-colors"></label>
                  <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-4 pointer-events-none"></div>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">保留天数</span>
                <span className="font-semibold">90天</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">归档时间</span>
                <span className="font-semibold">每日 02:00</span>
              </div>
            </div>
          </div>
          
          {/* 快速操作 */}
          <div className="bg-white dark:bg-card rounded-lg shadow-sm border border-border p-4">
            <h2 className="text-lg font-semibold mb-4">快速操作</h2>
            <div className="space-y-2">
              <button className="w-full px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors">
                立即归档
              </button>
              <button className="w-full px-4 py-2 bg-secondary text-secondary-foreground rounded hover:bg-secondary/80 transition-colors">
                查看归档日志
              </button>
              <button className="w-full px-4 py-2 bg-secondary text-secondary-foreground rounded hover:bg-secondary/80 transition-colors">
                恢复归档
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ArchiveCenterPage;
