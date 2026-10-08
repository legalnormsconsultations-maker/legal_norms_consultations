import { AdminRepository } from "../repositories/admin.repository";

export class AdminService {
  private repository: AdminRepository;

  constructor() {
    this.repository = new AdminRepository();
  }

  async getAdminAuditLogs() {
    return await this.repository.getAllAuditLogs();
  }

  async getAdminDrugs() {
    return await this.repository.getAllDrugs();
  }

  async getAdminUsers() {
    return await this.repository.getAllUsers();
  }

  async getAdminRegulatoryEvents() {
    return await this.repository.getAllRegulatoryEvents();
  }

  async getAdminDocuments() {
    return await this.repository.getAllDocuments();
  }
}
