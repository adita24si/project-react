import React, { useContext, useState, useMemo } from "react";
import { CRMContext } from "../context/CRMContext";
import { 
  FiPlus, FiChevronRight, FiChevronLeft, FiCalendar, 
  FiSettings, FiBriefcase, FiDollarSign, FiClock, FiTrash2, FiEdit2 
} from "react-icons/fi";
import Avatar from "../components/ui/Avatar";
import Modal from "../components/ui/Modal";

const C = {
  primary: "#79553D",      // Walnut Wood
  primaryBg: "#FAF6F3",    // Sand Beige
  primaryHover: "#634430",
  bg: "#FAFAFA",
  surface: "#FFFFFF",
  border: "#E8E2DD",
  textDark: "#2B2420",     // Charcoal
  textMuted: "#8A817A",    // Muted Earthy
  successBg: "#E6ECE5",
  successText: "#4A6B46",
  warningBg: "#F9F0E5",
  warningText: "#A86E2E",
  infoBg: "#E5ECEF",
  infoText: "#3E6B89"
};

const STAGES = [
  { key: "Concept", label: "Concept / Draft", desc: "Design & 3D Drafting", color: C.infoText, bg: C.infoBg },
  { key: "Material Selection", label: "Material Selection", desc: "Wood & Fabric Choice", color: C.warningText, bg: C.warningBg },
  { key: "Production", label: "Production / Crafting", desc: "Awaiting Carpentry", color: C.primary, bg: C.primaryBg },
  { key: "Quality Control", label: "Quality Control", desc: "Polishing & QA", color: "#8B5CF6", bg: "#F5F3FF" },
  { key: "Delivered", label: "Delivered", desc: "Installed at Client", color: C.successText, bg: C.successBg }
];

export default function CustomProjects() {
  const { customProjects, customers, addCustomProject, updateCustomProject } = useContext(CRMContext);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  
  // New/Edit Project Form State
  const [projectForm, setProjectForm] = useState({
    customerId: "",
    projectName: "",
    budget: "",
    woodType: "Walnut Wood",
    finishType: "Matte Polyurethane",
    status: "Concept",
    targetDate: ""
  });

  // Open modal for adding
  const handleOpenAddModal = () => {
    setEditingProject(null);
    setProjectForm({
      customerId: customers[0]?.id || "",
      projectName: "",
      budget: "",
      woodType: "Walnut Wood",
      finishType: "Matte Polyurethane",
      status: "Concept",
      targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0] // +30 days
    });
    setIsModalOpen(true);
  };

  // Open modal for editing
  const handleOpenEditModal = (project) => {
    setEditingProject(project);
    setProjectForm({
      customerId: project.customerId,
      projectName: project.projectName,
      budget: project.budget,
      woodType: project.woodType,
      finishType: project.finishType,
      status: project.status,
      targetDate: project.targetDate
    });
    setIsModalOpen(true);
  };

  // Form Submit Handler
  const handleSubmit = (e) => {
    e.preventDefault();
    const selectedCustomer = customers.find(c => String(c.id) === String(projectForm.customerId));
    const customerName = selectedCustomer ? selectedCustomer.name : "Unknown Customer";

    const projectData = {
      ...projectForm,
      budget: Number(projectForm.budget) || 0,
      customerName
    };

    if (editingProject) {
      updateCustomProject({
        ...editingProject,
        ...projectData
      });
    } else {
      addCustomProject(projectData);
    }
    setIsModalOpen(false);
  };

  // Handle move stage quick action
  const handleMoveStage = (project, direction) => {
    const currentIdx = STAGES.findIndex(s => s.key === project.status);
    let nextIdx = currentIdx + direction;
    if (nextIdx >= 0 && nextIdx < STAGES.length) {
      updateCustomProject({
        ...project,
        status: STAGES[nextIdx].key
      });
    }
  };

  // Grouped projects by status
  const projectsByStage = useMemo(() => {
    const grouped = {};
    STAGES.forEach(s => {
      grouped[s.key] = [];
    });
    customProjects.forEach(p => {
      if (grouped[p.status]) {
        grouped[p.status].push(p);
      } else {
        // Fallback for matches
        grouped["Concept"].push(p);
      }
    });
    return grouped;
  }, [customProjects]);

  return (
    <div className="p-6 min-h-screen text-[#2B2420]" style={{ background: C.bg, fontFamily: "'Inter', sans-serif" }}>
      {/* ── Page Header ── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-serif font-bold tracking-tight text-[#2B2420] flex items-center gap-2">
            <FiBriefcase className="text-[#79553D]" /> Custom Projects Board
          </h2>
          <p className="text-xs text-[#8A817A] mt-1">
            Handcrafted luxury furniture workflow tracking, from draft designs to white-glove installation.
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 px-4 py-2 bg-[#79553D] hover:bg-[#634430] text-white rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer shadow-sm border-none"
        >
          <FiPlus className="text-sm" /> New Project
        </button>
      </div>

      {/* ── Kanban Board Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-start">
        {STAGES.map(stage => {
          const stageProjects = projectsByStage[stage.key] || [];
          return (
            <div 
              key={stage.key} 
              className="rounded-2xl border border-[#E8E2DD] p-3 flex flex-col min-h-[500px]"
              style={{ background: "#FFFFFF" }}
            >
              {/* Column Header */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#2B2420]">
                    {stage.label}
                  </span>
                  <span 
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style={{ background: stage.bg, color: stage.color }}
                  >
                    {stageProjects.length}
                  </span>
                </div>
                <p className="text-[10px] text-[#8A817A] italic leading-tight">{stage.desc}</p>
                <div className="h-0.5 w-full mt-2 rounded-full" style={{ background: stage.color }} />
              </div>

              {/* Cards list */}
              <div className="flex-1 flex flex-col gap-3">
                {stageProjects.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center border border-dashed border-[#E8E2DD] rounded-xl p-4 text-center">
                    <p className="text-[10px] text-[#8A817A]">No projects in stage</p>
                  </div>
                ) : (
                  stageProjects.map(project => (
                    <div 
                      key={project.id}
                      className="border border-[#E8E2DD] rounded-xl p-3 hover:shadow-md hover:border-[#79553D]/30 transition-all duration-200 relative group flex flex-col justify-between"
                      style={{ background: "#FCFAF8" }}
                    >
                      <div>
                        {/* Project Title & Edit Action */}
                        <div className="flex justify-between items-start gap-2 mb-1.5">
                          <h4 className="text-xs font-bold text-[#2B2420] line-clamp-2 leading-snug">
                            {project.projectName}
                          </h4>
                          <button
                            onClick={() => handleOpenEditModal(project)}
                            className="p-1 text-[#8A817A] hover:text-[#79553D] hover:bg-[#F5ECE5] rounded-md transition-all cursor-pointer border-none bg-transparent"
                            title="Edit Project"
                          >
                            <FiEdit2 className="text-[10px]" />
                          </button>
                        </div>

                        {/* Customer Avatar & Name */}
                        <div className="flex items-center gap-2 mb-3">
                          <Avatar name={project.customerName} size="sm" />
                          <span className="text-[10px] font-medium text-[#8A817A] truncate max-w-[120px]">
                            {project.customerName}
                          </span>
                        </div>

                        {/* Specs & Budget Info */}
                        <div className="bg-white p-2 rounded-lg border border-[#E8E2DD] mb-3 flex flex-col gap-1 text-[10px]">
                          <div className="flex justify-between">
                            <span className="text-[#8A817A]">Wood:</span>
                            <span className="font-semibold text-[#2B2420]">{project.woodType}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[#8A817A]">Finish:</span>
                            <span className="font-semibold text-[#2B2420] text-right truncate max-w-[90px]">{project.finishType}</span>
                          </div>
                          <div className="flex justify-between border-t border-[#F3F4F6] pt-1 mt-1">
                            <span className="text-[#8A817A]">Budget:</span>
                            <span className="font-extrabold text-[#79553D]">
                              {(project.budget || 0).toLocaleString("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 })}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Footer: Target Date & Stage controls */}
                      <div className="flex justify-between items-center mt-auto border-t border-[#F3F4F6] pt-2">
                        <div className="flex items-center gap-1 text-[9px] text-[#8A817A]">
                          <FiCalendar className="text-[10px]" />
                          <span>{project.targetDate}</span>
                        </div>
                        
                        <div className="flex gap-1">
                          <button
                            disabled={project.status === "Concept"}
                            onClick={() => handleMoveStage(project, -1)}
                            className="p-1 bg-white hover:bg-[#F5ECE5] disabled:opacity-30 disabled:hover:bg-white border border-[#E8E2DD] rounded-md text-[#2B2420] disabled:cursor-not-allowed cursor-pointer"
                            title="Move back"
                          >
                            <FiChevronLeft className="text-[10px]" />
                          </button>
                          <button
                            disabled={project.status === "Delivered"}
                            onClick={() => handleMoveStage(project, 1)}
                            className="p-1 bg-white hover:bg-[#F5ECE5] disabled:opacity-30 disabled:hover:bg-white border border-[#E8E2DD] rounded-md text-[#2B2420] disabled:cursor-not-allowed cursor-pointer"
                            title="Move forward"
                          >
                            <FiChevronRight className="text-[10px]" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Add / Edit Project Modal ── */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProject ? "Edit Custom Project" : "New Custom Project"}
        size="md"
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-xs">
          {/* Customer Selection */}
          <div className="flex flex-col gap-1.5">
            <label className="font-bold text-[#2B2420]">Customer Link</label>
            <select
              value={projectForm.customerId}
              onChange={(e) => setProjectForm({ ...projectForm, customerId: e.target.value })}
              className="w-full h-10 px-3 rounded-lg border border-[#E8E2DD] bg-white outline-none focus:border-[#79553D]"
              required
            >
              {customers.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.loyalty})
                </option>
              ))}
            </select>
          </div>

          {/* Project Name */}
          <div className="flex flex-col gap-1.5">
            <label className="font-bold text-[#2B2420]">Project Name</label>
            <input
              type="text"
              placeholder="e.g. Premium Teak Dining Cabinet"
              value={projectForm.projectName}
              onChange={(e) => setProjectForm({ ...projectForm, projectName: e.target.value })}
              className="w-full h-10 px-3 rounded-lg border border-[#E8E2DD] outline-none focus:border-[#79553D]"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Wood Type */}
            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-[#2B2420]">Wood Type</label>
              <select
                value={projectForm.woodType}
                onChange={(e) => setProjectForm({ ...projectForm, woodType: e.target.value })}
                className="w-full h-10 px-3 rounded-lg border border-[#E8E2DD] bg-white outline-none focus:border-[#79553D]"
              >
                <option value="Walnut Wood">Walnut Wood</option>
                <option value="Teak Wood">Teak Wood</option>
                <option value="Oak Wood">Oak Wood</option>
                <option value="Mahogany Wood">Mahogany Wood</option>
                <option value="Rattan Accent">Rattan Accent</option>
              </select>
            </div>

            {/* Finish Type */}
            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-[#2B2420]">Finish Coating</label>
              <select
                value={projectForm.finishType}
                onChange={(e) => setProjectForm({ ...projectForm, finishType: e.target.value })}
                className="w-full h-10 px-3 rounded-lg border border-[#E8E2DD] bg-white outline-none focus:border-[#79553D]"
              >
                <option value="Matte Polyurethane">Matte Polyurethane</option>
                <option value="Natural Hardwax Oil">Natural Hardwax Oil</option>
                <option value="Satin Lacquer">Satin Lacquer</option>
                <option value="High Gloss Varnish">High Gloss Varnish</option>
                <option value="Rustic Distressed">Rustic Distressed</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Budget */}
            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-[#2B2420]">Budget (IDR)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8A817A] font-bold">Rp</span>
                <input
                  type="number"
                  placeholder="e.g. 25000000"
                  value={projectForm.budget}
                  onChange={(e) => setProjectForm({ ...projectForm, budget: e.target.value })}
                  className="w-full h-10 pl-9 pr-3 rounded-lg border border-[#E8E2DD] outline-none focus:border-[#79553D]"
                  required
                />
              </div>
            </div>

            {/* Target Date */}
            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-[#2B2420]">Target Delivery Date</label>
              <input
                type="date"
                value={projectForm.targetDate}
                onChange={(e) => setProjectForm({ ...projectForm, targetDate: e.target.value })}
                className="w-full h-10 px-3 rounded-lg border border-[#E8E2DD] outline-none focus:border-[#79553D]"
                required
              />
            </div>
          </div>

          {/* Project Status */}
          <div className="flex flex-col gap-1.5">
            <label className="font-bold text-[#2B2420]">Stage</label>
            <select
              value={projectForm.status}
              onChange={(e) => setProjectForm({ ...projectForm, status: e.target.value })}
              className="w-full h-10 px-3 rounded-lg border border-[#E8E2DD] bg-white outline-none focus:border-[#79553D]"
            >
              {STAGES.map(s => (
                <option key={s.key} value={s.key}>{s.label}</option>
              ))}
            </select>
          </div>

          {/* Action buttons */}
          <div className="flex justify-end gap-2.5 mt-4 border-t border-[#E8E2DD] pt-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 border border-[#E8E2DD] rounded-xl text-[#2B2420] hover:bg-[#FAF6F3] font-bold transition-all cursor-pointer bg-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#79553D] text-white rounded-xl font-bold hover:bg-[#634430] transition-all cursor-pointer border-none"
            >
              {editingProject ? "Save Changes" : "Create Project"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
