import React, { useState, useEffect } from 'react';
import { 
  Role, 
  Teacher, 
  WeightMatrix, 
  TeacherEvaluation, 
  AuditLogItem, 
  PassiveLog, 
  EvidenceItem, 
  IDPPlan, 
  AppealDispute,
  DepartmentInfo,
  EmulationMovement,
  MovementParticipation,
  AttendanceRecord,
  SelfDeclarationRecord
} from './types';
import { 
  MOCK_TEACHERS, 
  INITIAL_CRITERIA, 
  INITIAL_WEIGHT_MATRICES, 
  INITIAL_AUDIT_LOGS, 
  INITIAL_APPEALS,
  INITIAL_DEPARTMENT_INFOS,
  INITIAL_EMULATION_MOVEMENTS,
  INITIAL_MOVEMENT_PARTICIPATIONS,
  INITIAL_ATTENDANCE_RECORDS,
  INITIAL_SELF_DECLARATIONS
} from './data/mockData';

import { Navbar } from './components/Navbar';
import { Sidebar, TabType } from './components/Sidebar';
import { OverviewTab } from './components/Dashboard/OverviewTab';
import { AdminDeptStaffTab } from './components/Admin/AdminDeptStaffTab';
import { MovementsAndAwardsTab } from './components/Admin/MovementsAndAwardsTab';
import { AttendanceAndTardinessTab } from './components/Admin/AttendanceAndTardinessTab';
import { SelfDeclarationAndApprovalTab } from './components/Evaluation/SelfDeclarationAndApprovalTab';
import { WeightMatrixSandboxTab } from './components/Admin/WeightMatrixSandboxTab';
import { Evaluation360Tab } from './components/Evaluation/Evaluation360Tab';
import { PassiveDataTab } from './components/DataCollector/PassiveDataTab';
import { TemplateImportExportModal } from './components/DataCollector/TemplateImportExportModal';
import { TeacherPortfolioTab } from './components/Portfolio/TeacherPortfolioTab';
import { MoETReportTab } from './components/Reports/MoETReportTab';
import { AIConsultantChatModal } from './components/AI/AIConsultantChatModal';
import { ApiKeyGuideModal } from './components/Modals/ApiKeyGuideModal';
import { syncGoogleSheetsData } from './services/apiClient';
import { getStoredApiKey } from './services/geminiClient';
import { cleanTeachersList } from './utils/sanitizer';

export default function App() {
  const [currentRole, setCurrentRole] = useState<Role>('ADMIN_PRINCIPAL');
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  
  // Data State with auto-sanitization and localStorage persistence
  const [teachers, setTeachers] = useState<Teacher[]>(() => {
    try {
      const saved = localStorage.getItem('edueval_teachers_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const { cleanTeachers } = cleanTeachersList(parsed);
          return cleanTeachers;
        }
      }
    } catch (e) {
      console.error('Error loading teachers from localStorage:', e);
    }
    return MOCK_TEACHERS;
  });

  // Save clean teachers to localStorage whenever updated
  useEffect(() => {
    try {
      const { cleanTeachers } = cleanTeachersList(teachers);
      localStorage.setItem('edueval_teachers_v2', JSON.stringify(cleanTeachers));
    } catch (e) {
      console.error('Error saving teachers to localStorage:', e);
    }
  }, [teachers]);

  const [departments, setDepartments] = useState<DepartmentInfo[]>(INITIAL_DEPARTMENT_INFOS);
  const [movements, setMovements] = useState<EmulationMovement[]>(INITIAL_EMULATION_MOVEMENTS);
  const [participations, setParticipations] = useState<MovementParticipation[]>(INITIAL_MOVEMENT_PARTICIPATIONS);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(INITIAL_ATTENDANCE_RECORDS);
  const [selfDeclarations, setSelfDeclarations] = useState<SelfDeclarationRecord[]>(INITIAL_SELF_DECLARATIONS);

  const [weightMatrices, setWeightMatrices] = useState<WeightMatrix[]>(INITIAL_WEIGHT_MATRICES);
  const [activeMatrix, setActiveMatrix] = useState<WeightMatrix>(
    INITIAL_WEIGHT_MATRICES.find((m) => m.isActive) || INITIAL_WEIGHT_MATRICES[0]
  );
  const [criteria, setCriteria] = useState(INITIAL_CRITERIA);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(INITIAL_AUDIT_LOGS);
  const [appeals, setAppeals] = useState<AppealDispute[]>(INITIAL_APPEALS);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('Tất cả Tổ chuyên môn');
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [isAIChatOpen, setIsAIChatOpen] = useState<boolean>(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState<boolean>(false);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState<boolean>(false);
  const [hasApiKey, setHasApiKey] = useState<boolean>(false);

  // Check stored API key on mount
  useEffect(() => {
    const key = getStoredApiKey();
    setHasApiKey(!!key);
    if (!key) {
      setIsApiKeyModalOpen(true);
    }
  }, []);

  // Filter teachers based on search query & department
  const filteredTeachers = teachers.filter((t) => {
    const matchSearch = 
      t.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchDept = 
      selectedDepartment === 'Tất cả Tổ chuyên môn' || t.department === selectedDepartment;
    return matchSearch && matchDept;
  });

  const anomalyCount = teachers.filter((t) => t.currentEvaluation?.isAnomaly).length;
  const pendingApprovalsCount = teachers.filter(
    (t) => t.currentEvaluation?.status === 'HEAD_REVIEWED'
  ).length;

  // Handlers for Data Mutations
  const handleUpdateTeacherEvaluation = (teacherId: string, evaluation: TeacherEvaluation) => {
    setTeachers((prev) =>
      prev.map((t) => (t.id === teacherId ? { ...t, currentEvaluation: evaluation } : t))
    );

    // Add Audit Log
    const targetTeacher = teachers.find((t) => t.id === teacherId);
    const newLog: AuditLogItem = {
      id: `log_${Date.now()}`,
      timestamp: new Date().toLocaleString('vi-VN'),
      actorName: currentRole === 'ADMIN_PRINCIPAL' ? 'Hiệu trưởng Nguyễn Minh Trí' : (currentRole === 'HEAD_OF_DEPARTMENT' ? 'Tổ trưởng chuyên môn' : 'Giáo viên'),
      actorRole: currentRole,
      action: evaluation.digitalSignature ? 'KÝ SỐ PHÊ DUYỆT ĐÁNH GIÁ' : 'CẬP NHẬT ĐIỂM ĐÁNH GIÁ',
      targetTeacherName: targetTeacher?.fullName || teacherId,
      details: `Đã cập nhật điểm đánh giá cuối: ${evaluation.finalScore} điểm (${evaluation.classification}).`,
      ipAddress: '118.70.124.18',
      signedHash: evaluation.digitalSignature?.hash,
    };

    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const handleApplyMatrixToSystem = (newMatrix: WeightMatrix) => {
    setActiveMatrix(newMatrix);
    setWeightMatrices((prev) =>
      prev.map((m) => ({
        ...m,
        isActive: m.id === newMatrix.id,
      }))
    );

    // Recalculate evaluation criteria weights
    setCriteria((prev) =>
      prev.map((c) => {
        if (c.category === 'chuyen_mon') return { ...c, weightPercent: newMatrix.chuyenMonWeight };
        if (c.category === 'dao_duc_ky_luat') return { ...c, weightPercent: newMatrix.daoDucWeight };
        if (c.category === 'doi_moi_cntt') return { ...c, weightPercent: newMatrix.doiMoiCnttWeight };
        if (c.category === 'thi_dua_phong_trao') return { ...c, weightPercent: newMatrix.thiDuaWeight };
        return c;
      })
    );

    // Audit Log entry
    const newLog: AuditLogItem = {
      id: `log_mat_${Date.now()}`,
      timestamp: new Date().toLocaleString('vi-VN'),
      actorName: 'Hiệu trưởng Nguyễn Minh Trí',
      actorRole: 'ADMIN_PRINCIPAL',
      action: 'CẬP NHẬT MA TRẬN TRỌNG SỐ',
      targetTeacherName: 'Toàn bộ viên chức nhà trường',
      details: `Đã áp dụng ma trận trọng số mới: Chuyên môn ${newMatrix.chuyenMonWeight}%, Đạo đức ${newMatrix.daoDucWeight}%, CNTT ${newMatrix.doiMoiCnttWeight}%, Phong trào ${newMatrix.thiDuaWeight}%.`,
      ipAddress: '118.70.124.18',
    };

    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const handleAddPassiveLog = (teacherId: string, log: PassiveLog) => {
    setTeachers((prev) =>
      prev.map((t) => {
        if (t.id !== teacherId) return t;
        const newPassiveLogs = [log, ...t.passiveLogs];
        const newPassiveTotal = newPassiveLogs.reduce((acc, curr) => acc + curr.points, 0);

        const currentEval = t.currentEvaluation;
        let newFinalScore = currentEval?.finalScore || 85;
        if (currentEval) {
          newFinalScore = Math.min(100, Math.max(0, parseFloat((newFinalScore + log.points).toFixed(1))));
        }

        return {
          ...t,
          passiveLogs: newPassiveLogs,
          currentEvaluation: currentEval ? {
            ...currentEval,
            passivePointsTotal: newPassiveTotal,
            finalScore: newFinalScore,
          } : undefined,
        };
      })
    );

    const targetTeacher = teachers.find((t) => t.id === teacherId);
    const newAuditLog: AuditLogItem = {
      id: `log_pl_${Date.now()}`,
      timestamp: new Date().toLocaleString('vi-VN'),
      actorName: 'Hệ thống Thu thập Thụ động Bot',
      actorRole: 'SYSTEM_BOT',
      action: 'THU THẬP ĐIỂM THỤ ĐỘNG',
      targetTeacherName: targetTeacher?.fullName || teacherId,
      details: `Ghi nhận ${log.type === 'BONUS' ? '+' : ''}${log.points}đ từ nguồn ${log.source} (${log.title}).`,
      ipAddress: '127.0.0.1',
    };

    setAuditLogs((prev) => [newAuditLog, ...prev]);
  };

  const handleUpdateTeacherIDP = (teacherId: string, idp: IDPPlan) => {
    setTeachers((prev) =>
      prev.map((t) => (t.id === teacherId ? { ...t, idpPlan: idp } : t))
    );
  };

  const handleAddEvidence = (teacherId: string, evidence: EvidenceItem) => {
    setTeachers((prev) =>
      prev.map((t) => (t.id === teacherId ? { ...t, evidences: [evidence, ...t.evidences] } : t))
    );
  };

  const handleResolveAppeal = (appealId: string, status: 'RESOLVED' | 'REJECTED', note: string) => {
    setAppeals((prev) =>
      prev.map((a) => (a.id === appealId ? { ...a, status, responseNote: note } : a))
    );
  };

  const handleSyncSheets = async () => {
    setIsSyncing(true);
    await syncGoogleSheetsData();
    setIsSyncing(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-800 antialiased selection:bg-blue-600 selection:text-white">
      
      {/* Top Header Navbar */}
      <Navbar
        currentRole={currentRole}
        setCurrentRole={setCurrentRole}
        selectedDepartment={selectedDepartment}
        setSelectedDepartment={setSelectedDepartment}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenAIChat={() => setIsAIChatOpen(true)}
        onSyncSheets={handleSyncSheets}
        isSyncing={isSyncing}
        anomalyCount={anomalyCount}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        hasApiKey={hasApiKey}
      />

      {/* Main Workspace Layout */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex flex-col md:flex-row gap-0 md:gap-6 p-4 sm:p-6">
        
        {/* Navigation Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          anomalyCount={anomalyCount}
          pendingApprovalsCount={pendingApprovalsCount}
        />

        {/* Tab Content Area */}
        <main className="flex-1 min-w-0 mt-4 md:mt-0">
          {activeTab === 'overview' && (
            <OverviewTab
              teachers={filteredTeachers}
              currentRole={currentRole}
              onOpenAIChat={() => setIsAIChatOpen(true)}
              onSelectTeacherForIDP={(t) => {
                setActiveTab('portfolio_idp');
              }}
            />
          )}

          {activeTab === 'admin_dept_staff' && (
            <AdminDeptStaffTab
              departments={departments}
              setDepartments={setDepartments}
              teachers={teachers}
              setTeachers={setTeachers}
              onOpenTemplateModal={() => setIsTemplateModalOpen(true)}
              onAddAuditLog={(action, targetName, details) => {
                const newLog: AuditLogItem = {
                  id: `log_admin_${Date.now()}`,
                  timestamp: new Date().toLocaleString('vi-VN'),
                  actorName: 'Quản trị viên Hệ thống',
                  actorRole: currentRole,
                  action,
                  targetTeacherName: targetName,
                  details,
                  ipAddress: '118.70.124.18',
                };
                setAuditLogs((prev) => [newLog, ...prev]);
              }}
            />
          )}

          {activeTab === 'movements_awards' && (
            <MovementsAndAwardsTab
              movements={movements}
              setMovements={setMovements}
              participations={participations}
              setParticipations={setParticipations}
              teachers={teachers}
              onAddPassiveLog={handleAddPassiveLog}
              onAddAuditLog={(action, targetName, details) => {
                const newLog: AuditLogItem = {
                  id: `log_mov_${Date.now()}`,
                  timestamp: new Date().toLocaleString('vi-VN'),
                  actorName: 'Ban Giám Hiệu / Admin',
                  actorRole: currentRole,
                  action,
                  targetTeacherName: targetName,
                  details,
                  ipAddress: '118.70.124.18',
                };
                setAuditLogs((prev) => [newLog, ...prev]);
              }}
            />
          )}

          {activeTab === 'attendance_tardiness' && (
            <AttendanceAndTardinessTab
              attendanceRecords={attendanceRecords}
              setAttendanceRecords={setAttendanceRecords}
              teachers={teachers}
              currentRole={currentRole}
              onAddPassiveLog={handleAddPassiveLog}
              onAddAuditLog={(action, targetName, details) => {
                const newLog: AuditLogItem = {
                  id: `log_att_${Date.now()}`,
                  timestamp: new Date().toLocaleString('vi-VN'),
                  actorName: 'Ban Giám Hiệu / BGH',
                  actorRole: currentRole,
                  action,
                  targetTeacherName: targetName,
                  details,
                  ipAddress: '118.70.124.18',
                };
                setAuditLogs((prev) => [newLog, ...prev]);
              }}
            />
          )}

          {activeTab === 'self_declaration' && (
            <SelfDeclarationAndApprovalTab
              selfDeclarations={selfDeclarations}
              setSelfDeclarations={setSelfDeclarations}
              teachers={teachers}
              currentRole={currentRole}
              onAddPassiveLog={handleAddPassiveLog}
              onOpenTemplateModal={() => setIsTemplateModalOpen(true)}
              onAddAuditLog={(action, targetName, details) => {
                const newLog: AuditLogItem = {
                  id: `log_sd_${Date.now()}`,
                  timestamp: new Date().toLocaleString('vi-VN'),
                  actorName: currentRole === 'ADMIN_PRINCIPAL' ? 'Hiệu trưởng / BGH' : 'Tổ trưởng chuyên môn',
                  actorRole: currentRole,
                  action,
                  targetTeacherName: targetName,
                  details,
                  ipAddress: '118.70.124.18',
                };
                setAuditLogs((prev) => [newLog, ...prev]);
              }}
            />
          )}

          {activeTab === 'matrix_sandbox' && (
            <WeightMatrixSandboxTab
              weightMatrices={weightMatrices}
              activeMatrix={activeMatrix}
              setActiveMatrix={setActiveMatrix}
              criteria={criteria}
              teachers={teachers}
              onApplyMatrixToSystem={handleApplyMatrixToSystem}
            />
          )}

          {activeTab === 'evaluation_360' && (
            <Evaluation360Tab
              teachers={filteredTeachers}
              currentRole={currentRole}
              criteria={criteria}
              appeals={appeals}
              onUpdateTeacherEvaluation={handleUpdateTeacherEvaluation}
              onResolveAppeal={handleResolveAppeal}
            />
          )}

          {activeTab === 'passive_collector' && (
            <PassiveDataTab
              teachers={teachers}
              auditLogs={auditLogs}
              onAddPassiveLog={handleAddPassiveLog}
              onOpenTemplateModal={() => setIsTemplateModalOpen(true)}
            />
          )}

          {activeTab === 'portfolio_idp' && (
            <TeacherPortfolioTab
              teachers={teachers}
              onUpdateTeacherIDP={handleUpdateTeacherIDP}
              onAddEvidence={handleAddEvidence}
            />
          )}

          {activeTab === 'moet_reports' && (
            <MoETReportTab teachers={filteredTeachers} />
          )}
        </main>

      </div>

      {/* AI Consultant Popup Chat */}
      <AIConsultantChatModal
        isOpen={isAIChatOpen}
        onClose={() => setIsAIChatOpen(false)}
        systemContext={{
          totalTeachers: teachers.length,
          activeMatrixName: activeMatrix.name,
          anomalyCount,
        }}
        onOpenApiKeyModal={() => {
          setIsAIChatOpen(false);
          setIsApiKeyModalOpen(true);
        }}
      />

      {/* API Key 1-2-3 Guide & Settings Modal */}
      <ApiKeyGuideModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        onKeyUpdated={(hasKey) => setHasApiKey(hasKey)}
      />

      {/* Export / Import Template Modal */}
      <TemplateImportExportModal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        teachers={teachers}
        setTeachers={setTeachers}
        selfDeclarations={selfDeclarations}
        setSelfDeclarations={setSelfDeclarations}
        onAddPassiveLog={handleAddPassiveLog}
        onAddAuditLog={(action, targetName, details) => {
          const newLog: AuditLogItem = {
            id: `log_imp_${Date.now()}`,
            timestamp: new Date().toLocaleString('vi-VN'),
            actorName: 'Ban Giám Hiệu / Quản trị viên',
            actorRole: currentRole,
            action,
            targetTeacherName: targetName,
            details,
            ipAddress: '118.70.124.18',
          };
          setAuditLogs((prev) => [newLog, ...prev]);
        }}
      />

    </div>
  );
}
