/**
 * Data cleanup utilities for handling orphaned references
 */

import { Project } from '@/types/project';
import { StrategicIssue } from '@/types/strategicIssues';
import { Strategy } from '@/types/strategies';

/**
 * Clean up orphaned strategic issue references in projects
 */
export function cleanupOrphanedStrategicIssues(
  projects: Project[], 
  strategicIssues: StrategicIssue[]
): Project[] {
  const validIssueIds = new Set(strategicIssues.map(issue => issue.id));
  
  return projects.map(project => ({
    ...project,
    strategic_issues: project.strategic_issues.filter(issueId => validIssueIds.has(issueId))
  }));
}

/**
 * Clean up orphaned strategy references in projects
 */
export function cleanupOrphanedStrategies(
  projects: Project[], 
  strategies: Strategy[]
): Project[] {
  const validStrategyIds = new Set(strategies.map(strategy => strategy.id));
  
  return projects.map(project => ({
    ...project,
    strategies: project.strategies.filter(strategyId => validStrategyIds.has(strategyId))
  }));
}

/**
 * Clean up all orphaned references in projects
 */
export function cleanupOrphanedReferences(
  projects: Project[], 
  strategicIssues: StrategicIssue[], 
  strategies: Strategy[]
): Project[] {
  let cleanedProjects = cleanupOrphanedStrategicIssues(projects, strategicIssues);
  cleanedProjects = cleanupOrphanedStrategies(cleanedProjects, strategies);
  
  return cleanedProjects;
}

/**
 * Get display text for orphaned reference
 */
export function getOrphanedReferenceText(type: 'strategic_issue' | 'strategy'): string {
  switch (type) {
    case 'strategic_issue':
      return 'ประเด็น (ลบแล้ว)';
    case 'strategy':
      return 'กลยุทธ์ (ลบแล้ว)';
    default:
      return 'ข้อมูล (ลบแล้ว)';
  }
}

/**
 * Check if a project has any orphaned references
 */
export function hasOrphanedReferences(
  project: Project, 
  strategicIssues: StrategicIssue[], 
  strategies: Strategy[]
): boolean {
  const validIssueIds = new Set(strategicIssues.map(issue => issue.id));
  const validStrategyIds = new Set(strategies.map(strategy => strategy.id));
  
  const hasOrphanedIssues = project.strategic_issues.some(issueId => !validIssueIds.has(issueId));
  const hasOrphanedStrategies = project.strategies.some(strategyId => !validStrategyIds.has(strategyId));
  
  return hasOrphanedIssues || hasOrphanedStrategies;
}

/**
 * Get count of orphaned references
 */
export function getOrphanedReferencesCount(
  project: Project, 
  strategicIssues: StrategicIssue[], 
  strategies: Strategy[]
): { orphanedIssues: number; orphanedStrategies: number } {
  const validIssueIds = new Set(strategicIssues.map(issue => issue.id));
  const validStrategyIds = new Set(strategies.map(strategy => strategy.id));
  
  const orphanedIssues = project.strategic_issues.filter(issueId => !validIssueIds.has(issueId)).length;
  const orphanedStrategies = project.strategies.filter(strategyId => !validStrategyIds.has(strategyId)).length;
  
  return { orphanedIssues, orphanedStrategies };
}

/**
 * Format date to Thai Buddhist Era (พ.ศ.)
 */
export function getFormattedDateThai(dateString: string): string {
  if (!dateString) return '-';
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '-';
    
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear() + 543; // Convert to Buddhist Era
    
    // Thai month names
    const thaiMonths = [
      'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
      'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
    ];
    
    return `${day} ${thaiMonths[month - 1]} ${year}`;
  } catch {
    return '-';
  }
}

/**
 * Format date to Thai Buddhist Era with full month name
 */
export function getFormattedDateThaiLong(dateString: string): string {
  if (!dateString) return '-';
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '-';
    
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear() + 543; // Convert to Buddhist Era
    
    // Thai month names (full)
    const thaiMonthsFull = [
      'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
      'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
    ];
    
    return `${day} ${thaiMonthsFull[month - 1]} พ.ศ. ${year}`;
  } catch {
    return '-';
  }
}

/**
 * Format datetime to Thai Buddhist Era with time
 */
export function getFormattedDateTimeThai(dateString: string): string {
  if (!dateString) return '-';
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '-';
    
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear() + 543; // Convert to Buddhist Era
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    
    // Thai month names
    const thaiMonths = [
      'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
      'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
    ];
    
    return `${day} ${thaiMonths[month - 1]} ${year} ${hours}:${minutes} น.`;
  } catch {
    return '-';
  }
}
