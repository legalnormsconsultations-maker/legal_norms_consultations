import { db } from "@/db";
import { approvals, regulatoryApplications, drugs, regulatoryAuthorities } from "@/db/schema";
import { eq, desc, and, sql, isNotNull } from "drizzle-orm";

export class NdaTrendsRepository {
  /**
   * Fetches and aggregates all data needed for the NDA Trends Dashboard.
   */
  static async getDashboardData() {
    // 1. Fetch raw data to perform aggregations in memory, 
    // or perform SQL aggregations. Since this is an MVP, we'll fetch joined data
    // and aggregate in TypeScript for simplicity, or use SQL where easy.
    
    // Get all approved applications with drug info
    const applications = await db
      .select({
        id: regulatoryApplications.id,
        appType: regulatoryApplications.applicationType,
        pathway: regulatoryApplications.regulatoryPathway,
        submissionDate: regulatoryApplications.submissionDate,
        approvalDate: approvals.approvalDate,
        drugName: drugs.drugName,
        sponsor: drugs.manufacturer,
        categories: drugs.therapeuticCategories,
      })
      .from(regulatoryApplications)
      .innerJoin(approvals, eq(approvals.applicationId, regulatoryApplications.id))
      .innerJoin(drugs, eq(drugs.id, regulatoryApplications.drugId))
      .where(isNotNull(approvals.approvalDate));

    // Prepare aggregation structures
    const currentYear = new Date().getFullYear();
    const years = [currentYear - 4, currentYear - 3, currentYear - 2, currentYear - 1, currentYear];
    
    // Approvals By Year
    const approvalsByYearMap: Record<string, { year: string; nda: number; bla: number }> = {};
    years.forEach(y => approvalsByYearMap[y.toString()] = { year: y.toString(), nda: 0, bla: 0 });

    // Review Times By Year
    const reviewTimesMap: Record<string, { year: string; priorityTotal: number; priorityCount: number; standardTotal: number; standardCount: number }> = {};
    years.forEach(y => reviewTimesMap[y.toString()] = { year: y.toString(), priorityTotal: 0, priorityCount: 0, standardTotal: 0, standardCount: 0 });

    // Therapeutic Areas
    const therapeuticAreasMap: Record<string, number> = {};

    // Timeline Data (Latest 20 approvals)
    const timelineData: any[] = [];

    // Overall KPIs
    let totalApprovals = applications.length;
    let nmeCount = 0;
    let blaCount = 0;
    let priorityCount = 0;
    let totalReviewMonths = 0;
    let reviewMonthsCount = 0;

    applications.forEach(app => {
      if (!app.approvalDate) return;
      
      const approvalYear = new Date(app.approvalDate).getFullYear().toString();
      
      // Calculate review time in months
      let reviewTimeMonths = 0;
      if (app.submissionDate) {
        const diffTime = Math.abs(app.approvalDate.getTime() - app.submissionDate.getTime());
        reviewTimeMonths = diffTime / (1000 * 60 * 60 * 24 * 30.44); // approx months
        totalReviewMonths += reviewTimeMonths;
        reviewMonthsCount++;
      }

      // KPIs
      const isBla = app.appType?.toLowerCase().includes("bla");
      const isNda = app.appType?.toLowerCase().includes("nda");
      const isPriority = app.pathway?.toLowerCase().includes("priority");
      
      if (isBla) blaCount++;
      // We will assume NME (New Molecular Entity) if pathway or categories indicate it.
      // For simplicity, we just count standard NDAs as novel if they don't say "generic".
      if (!app.pathway?.toLowerCase().includes("generic")) nmeCount++;
      if (isPriority) priorityCount++;

      // Populate Approvals By Year
      if (approvalsByYearMap[approvalYear]) {
        if (isBla) approvalsByYearMap[approvalYear].bla++;
        if (isNda || (!isBla && !isNda)) approvalsByYearMap[approvalYear].nda++; // fallback to NDA
      }

      // Populate Review Times
      if (reviewTimesMap[approvalYear] && reviewTimeMonths > 0) {
        if (isPriority) {
          reviewTimesMap[approvalYear].priorityTotal += reviewTimeMonths;
          reviewTimesMap[approvalYear].priorityCount++;
        } else {
          reviewTimesMap[approvalYear].standardTotal += reviewTimeMonths;
          reviewTimesMap[approvalYear].standardCount++;
        }
      }

      // Populate Therapeutic Areas
      if (app.categories && Array.isArray(app.categories)) {
        app.categories.forEach(cat => {
          if (typeof cat === 'string') {
            therapeuticAreasMap[cat] = (therapeuticAreasMap[cat] || 0) + 1;
          }
        });
      }

      // Timeline (we will sort and slice later, but for now just push)
      timelineData.push({
        id: app.id.slice(0, 8),
        drug: app.drugName,
        sponsor: app.sponsor || "Unknown",
        submission: app.submissionDate ? new Date(app.submissionDate).toISOString().split('T')[0] : "Unknown",
        action: app.approvalDate ? new Date(app.approvalDate).toISOString().split('T')[0] : "Unknown",
        designation: isPriority ? "Priority" : "Standard",
        type: Array.isArray(app.categories) && app.categories.length > 0 ? app.categories[0] : "General",
        time: reviewTimeMonths > 0 ? Number(reviewTimeMonths.toFixed(1)) : 0
      });
    });

    // Finalize Review Times
    const reviewTimes = years.map(y => {
      const data = reviewTimesMap[y.toString()];
      return {
        year: y.toString(),
        priority: data.priorityCount > 0 ? Number((data.priorityTotal / data.priorityCount).toFixed(1)) : 0,
        standard: data.standardCount > 0 ? Number((data.standardTotal / data.standardCount).toFixed(1)) : 0,
      };
    });

    // Finalize Therapeutic Areas (Top 6)
    const therapeuticAreas = Object.entries(therapeuticAreasMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
      
    // If empty DB, provide empty arrays instead of crashing
    const finalTimeline = timelineData.sort((a, b) => new Date(b.action).getTime() - new Date(a.action).getTime()).slice(0, 20);

    return {
      kpis: {
        totalApprovals,
        nmeApprovals: nmeCount,
        blaApprovals: blaCount,
        priorityPercentage: totalApprovals > 0 ? Math.round((priorityCount / totalApprovals) * 100) : 0,
        medianReviewMonths: reviewMonthsCount > 0 ? Number((totalReviewMonths / reviewMonthsCount).toFixed(1)) : 0,
      },
      approvalsByYear: Object.values(approvalsByYearMap),
      reviewTimes,
      therapeuticAreas,
      timelineData: finalTimeline
    };
  }
}
