import React, { useState, useEffect } from 'react';
import {
    Shield, CheckCircle, XCircle, AlertTriangle, RefreshCw,
    ExternalLink, Lock, Eye, Server, FileText, ChevronDown, ChevronUp
} from 'lucide-react';
import { securityAuditService } from '../services/securityAuditService';
import styles from './AdminSecurityAudit.module.css';

const AdminSecurityAudit = () => {
    const [auditResult, setAuditResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [expandedCheck, setExpandedCheck] = useState(null);
    const [showPenTestGuide, setShowPenTestGuide] = useState(false);

    const runAudit = async () => {
        setLoading(true);
        try {
            const report = await securityAuditService.generateReport();
            setAuditResult(report);
        } catch (error) {
            console.error('Audit failed:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        runAudit();
    }, []);

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pass': return <CheckCircle size={24} color="#10b981" />;
            case 'warning': return <AlertTriangle size={24} color="#f59e0b" />;
            case 'fail': return <XCircle size={24} color="#ef4444" />;
            default: return <Shield size={24} />;
        }
    };

    const getScoreColor = (percentage) => {
        if (percentage >= 80) return '#10b981';
        if (percentage >= 60) return '#f59e0b';
        return '#ef4444';
    };

    const penTestGuide = securityAuditService.getPenTestingGuide();

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1><Shield size={28} /> Security Audit</h1>
                    <p>Automated security checks and penetration testing guide</p>
                </div>
                <button onClick={runAudit} disabled={loading} className={styles.runBtn}>
                    <RefreshCw size={18} className={loading ? styles.spin : ''} />
                    {loading ? 'Running...' : 'Run Audit'}
                </button>
            </div>

            {/* Score Overview */}
            {auditResult && (
                <div className={styles.scoreCard}>
                    <div className={styles.scoreMain}>
                        {getStatusIcon(auditResult.audit.status)}
                        <div>
                            <h2 style={{ color: getScoreColor(auditResult.audit.percentage) }}>
                                {auditResult.audit.percentage}%
                            </h2>
                            <p>Security Score</p>
                        </div>
                    </div>
                    <div className={styles.scoreDetails}>
                        <div className={styles.scoreStat}>
                            <span className={styles.scoreValue}>{auditResult.audit.checks.length}</span>
                            <span className={styles.scoreLabel}>Checks Run</span>
                        </div>
                        <div className={styles.scoreStat}>
                            <span className={styles.scoreValue}>{auditResult.audit.score}/{auditResult.audit.maxScore}</span>
                            <span className={styles.scoreLabel}>Points</span>
                        </div>
                        <div className={styles.scoreStat}>
                            <span className={styles.scoreValue}>{auditResult.audit.duration}ms</span>
                            <span className={styles.scoreLabel}>Duration</span>
                        </div>
                        <div className={styles.scoreStat}>
                            <span className={styles.scoreValue} style={{ color: auditResult.summary.criticalIssues > 0 ? '#ef4444' : '#10b981' }}>
                                {auditResult.summary.criticalIssues}
                            </span>
                            <span className={styles.scoreLabel}>Critical Issues</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Check Results */}
            {auditResult && (
                <div className={styles.checksSection}>
                    <h3>Security Checks</h3>
                    <div className={styles.checksList}>
                        {auditResult.audit.checks.map((check, index) => {
                            const percentage = (check.points / check.maxPoints) * 100;
                            const isExpanded = expandedCheck === index;

                            return (
                                <div key={index} className={styles.checkCard}>
                                    <div
                                        className={styles.checkHeader}
                                        onClick={() => setExpandedCheck(isExpanded ? null : index)}
                                    >
                                        <div className={styles.checkInfo}>
                                            <div
                                                className={styles.checkIndicator}
                                                style={{ background: getScoreColor(percentage) }}
                                            />
                                            <div>
                                                <h4>{check.name}</h4>
                                                <p>{check.description}</p>
                                            </div>
                                        </div>
                                        <div className={styles.checkScore}>
                                            <span style={{ color: getScoreColor(percentage) }}>
                                                {check.points}/{check.maxPoints}
                                            </span>
                                            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                        </div>
                                    </div>

                                    {isExpanded && (
                                        <div className={styles.checkDetails}>
                                            <div className={styles.findings}>
                                                <h5>Findings</h5>
                                                <ul>
                                                    {check.findings.map((finding, i) => (
                                                        <li key={i}>{finding}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                            {check.recommendations.length > 0 && (
                                                <div className={styles.recommendations}>
                                                    <h5>Recommendations</h5>
                                                    <ul>
                                                        {check.recommendations.map((rec, i) => (
                                                            <li key={i}>{rec}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Recommendations Summary */}
            {auditResult?.summary.recommendations.length > 0 && (
                <div className={styles.recommendationsSection}>
                    <h3><AlertTriangle size={20} /> Recommendations</h3>
                    <ul>
                        {auditResult.summary.recommendations.map((rec, i) => (
                            <li key={i}>{rec}</li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Penetration Testing Guide */}
            <div className={styles.penTestSection}>
                <div
                    className={styles.penTestHeader}
                    onClick={() => setShowPenTestGuide(!showPenTestGuide)}
                >
                    <div>
                        <h3><Lock size={20} /> {penTestGuide.title}</h3>
                        <p>{penTestGuide.description}</p>
                    </div>
                    {showPenTestGuide ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                </div>

                {showPenTestGuide && (
                    <div className={styles.penTestContent}>
                        <div className={styles.toolsSection}>
                            <h4>🛠️ Free Security Tools</h4>
                            <div className={styles.toolsGrid}>
                                {penTestGuide.freeTools.map((tool, i) => (
                                    <a
                                        key={i}
                                        href={tool.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={styles.toolCard}
                                    >
                                        <h5>{tool.name} <ExternalLink size={14} /></h5>
                                        <p>{tool.description}</p>
                                        <span className={styles.toolUsage}>{tool.usage}</span>
                                    </a>
                                ))}
                            </div>
                        </div>

                        <div className={styles.checklistSection}>
                            <h4>✅ Penetration Testing Checklist</h4>
                            <ul>
                                {penTestGuide.checklist.map((item, i) => (
                                    <li key={i}>
                                        <input type="checkbox" id={`check-${i}`} />
                                        <label htmlFor={`check-${i}`}>{item}</label>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className={styles.servicesSection}>
                            <h4>🏢 Professional Services</h4>
                            <div className={styles.servicesGrid}>
                                {penTestGuide.professionalServices.map((service, i) => (
                                    <div key={i} className={styles.serviceCard}>
                                        <h5>{service.name}</h5>
                                        <p>{service.description}</p>
                                        <span className={styles.serviceTier}>{service.tier}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Quick Actions */}
            <div className={styles.quickActions}>
                <h3>Quick Security Actions</h3>
                <div className={styles.actionButtons}>
                    <a
                        href="https://observatory.mozilla.org/analyze/peptidelog.net"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.actionBtn}
                    >
                        <Eye size={18} />
                        Mozilla Observatory
                    </a>
                    <a
                        href="https://www.ssllabs.com/ssltest/analyze.html?d=peptidelog.net"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.actionBtn}
                    >
                        <Lock size={18} />
                        SSL Labs Test
                    </a>
                    <a
                        href="https://securityheaders.com/?q=https://peptidelog.net"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.actionBtn}
                    >
                        <Server size={18} />
                        Security Headers
                    </a>
                    <a
                        href="https://snyk.io/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.actionBtn}
                    >
                        <FileText size={18} />
                        Snyk Scan
                    </a>
                </div>
            </div>
        </div>
    );
};

export default AdminSecurityAudit;
