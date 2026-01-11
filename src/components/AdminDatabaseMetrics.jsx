import React, { useState, useEffect, useCallback } from 'react';
import {
    Database, HardDrive, Zap, TrendingUp,
    RefreshCw, CheckCircle, AlertTriangle, Server,
    Layers, Clock, BarChart3, Gauge, Info
} from 'lucide-react';
import { supabaseMetricsService } from '../services/supabaseMetricsService';
import styles from './AdminDatabaseMetrics.module.css';

const AdminDatabaseMetrics = () => {
    const [metrics, setMetrics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [autoRefresh, setAutoRefresh] = useState(true);
    const [lastUpdated, setLastUpdated] = useState(null);
    // Historical data for future trend visualization (prefixed with underscore to indicate intentionally unused for now)
    const [_historicalData, setHistoricalData] = useState([]);

    const loadMetrics = useCallback(async (forceRefresh = false) => {
        try {
            setLoading(true);
            setError(null);
            const data = await supabaseMetricsService.getAllMetrics(forceRefresh);
            setMetrics(data);
            setLastUpdated(new Date());

            // Store historical data for trend visualization
            setHistoricalData(prev => {
                const newHistory = [...prev, {
                    timestamp: data.timestamp,
                    cacheHitRate: data.cache?.overallCacheHitRate || 0
                }];
                // Keep last 30 data points
                return newHistory.slice(-30);
            });
        } catch (err) {
            console.error('Failed to load metrics:', err);
            setError('Failed to load database metrics');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadMetrics(true);

        let unsubscribe;
        if (autoRefresh) {
            unsubscribe = supabaseMetricsService.subscribeToMetrics(
                (data) => {
                    setMetrics(data);
                    setLastUpdated(new Date());
                },
                60000 // 1 minute
            );
        }

        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, [autoRefresh, loadMetrics]);

    const getHealthStatusColor = (status) => {
        switch (status) {
            case 'excellent': return 'var(--accent-green)';
            case 'good': return 'var(--accent-blue)';
            case 'fair': return 'var(--accent-yellow)';
            case 'poor': return 'var(--accent-red)';
            default: return 'var(--text-muted)';
        }
    };

    const getCacheRateColor = (rate) => {
        if (rate >= 99) return 'var(--accent-green)';
        if (rate >= 95) return 'var(--accent-blue)';
        if (rate >= 90) return 'var(--accent-yellow)';
        return 'var(--accent-red)';
    };

    const formatNumber = (num) => {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num?.toLocaleString() || '0';
    };

    const getCacheRateEmoji = (rate) => {
        if (rate >= 99.9) return '🔥';
        if (rate >= 99) return '⚡';
        if (rate >= 95) return '✅';
        return '⚠️';
    };

    return (
        <div className={styles.container}>
            {/* Header */}
            <div className={styles.header}>
                <div className={styles.headerContent}>
                    <h1>
                        <Database className={styles.headerIcon} />
                        Database Metrics
                    </h1>
                    <p>Real-time Supabase performance monitoring and cache analytics</p>
                </div>
                <div className={styles.headerActions}>
                    <label className={styles.autoRefreshLabel}>
                        <input
                            type="checkbox"
                            checked={autoRefresh}
                            onChange={(e) => setAutoRefresh(e.target.checked)}
                        />
                        <span>Auto-refresh</span>
                    </label>
                    <button
                        className={styles.refreshBtn}
                        onClick={() => loadMetrics(true)}
                        disabled={loading}
                    >
                        <RefreshCw className={loading ? styles.spinning : ''} size={16} />
                        Refresh
                    </button>
                </div>
            </div>

            {/* Last Updated */}
            {lastUpdated && (
                <div className={styles.lastUpdated}>
                    <Clock size={14} />
                    Last updated: {lastUpdated.toLocaleTimeString()}
                </div>
            )}

            {/* Error State */}
            {error && (
                <div className={styles.errorBanner}>
                    <AlertTriangle size={18} />
                    {error}
                </div>
            )}

            {loading && !metrics ? (
                <div className={styles.loadingState}>
                    <div className={styles.loadingSpinner}></div>
                    <p>Loading database metrics...</p>
                </div>
            ) : metrics ? (
                <>
                    {/* Health Score Card */}
                    <div className={styles.healthScoreCard}>
                        <div className={styles.healthScoreMain}>
                            <div
                                className={styles.healthScoreCircle}
                                style={{
                                    '--score-color': getHealthStatusColor(metrics.health?.status),
                                    '--score-percent': `${metrics.health?.score || 0}%`
                                }}
                            >
                                <div className={styles.healthScoreInner}>
                                    <span className={styles.healthScoreNumber}>
                                        {metrics.health?.score || 0}
                                    </span>
                                    <span className={styles.healthScoreLabel}>Health Score</span>
                                </div>
                            </div>
                            <div className={styles.healthScoreDetails}>
                                <div
                                    className={styles.healthStatus}
                                    style={{ color: getHealthStatusColor(metrics.health?.status) }}
                                >
                                    {metrics.health?.status === 'excellent' && <CheckCircle size={20} />}
                                    {metrics.health?.status === 'good' && <TrendingUp size={20} />}
                                    {metrics.health?.status === 'fair' && <AlertTriangle size={20} />}
                                    {metrics.health?.status?.toUpperCase() || 'UNKNOWN'}
                                </div>
                                <p className={styles.projectRef}>
                                    Project: <code>{metrics.projectRef}</code>
                                </p>
                                {metrics.health?.issues?.length > 0 && (
                                    <ul className={styles.issuesList}>
                                        {metrics.health.issues.map((issue, i) => (
                                            <li key={i}>{issue}</li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Cache Hit Rate - Featured Card */}
                    <div className={styles.cacheHeroCard}>
                        <div className={styles.cacheHeroHeader}>
                            <Gauge size={24} />
                            <h2>Cache Hit Rate</h2>
                            <span className={styles.cacheEmoji}>
                                {getCacheRateEmoji(metrics.cache?.overallCacheHitRate)}
                            </span>
                        </div>
                        <div className={styles.cacheHeroValue}>
                            <span
                                className={styles.bigNumber}
                                style={{ color: getCacheRateColor(metrics.cache?.overallCacheHitRate) }}
                            >
                                {metrics.cache?.overallCacheHitRate?.toFixed(2) || '0.00'}
                            </span>
                            <span className={styles.percentSign}>%</span>
                            {metrics.cache?.isEstimated && (
                                <span className={styles.estimatedBadge}>
                                    <Info size={12} /> Estimated
                                </span>
                            )}
                        </div>
                        <div className={styles.cacheBreakdown}>
                            <div className={styles.cacheMetric}>
                                <div className={styles.cacheMetricLabel}>
                                    <Layers size={14} />
                                    Index Cache
                                </div>
                                <div className={styles.cacheMetricValue}>
                                    <span style={{ color: getCacheRateColor(metrics.cache?.indexHitRate) }}>
                                        {metrics.cache?.indexHitRate?.toFixed(2)}%
                                    </span>
                                </div>
                                <div className={styles.cacheProgressBar}>
                                    <div
                                        className={styles.cacheProgressFill}
                                        style={{
                                            width: `${metrics.cache?.indexHitRate || 0}%`,
                                            background: getCacheRateColor(metrics.cache?.indexHitRate)
                                        }}
                                    />
                                </div>
                            </div>
                            <div className={styles.cacheMetric}>
                                <div className={styles.cacheMetricLabel}>
                                    <HardDrive size={14} />
                                    Table Cache
                                </div>
                                <div className={styles.cacheMetricValue}>
                                    <span style={{ color: getCacheRateColor(metrics.cache?.tableHitRate) }}>
                                        {metrics.cache?.tableHitRate?.toFixed(2)}%
                                    </span>
                                </div>
                                <div className={styles.cacheProgressBar}>
                                    <div
                                        className={styles.cacheProgressFill}
                                        style={{
                                            width: `${metrics.cache?.tableHitRate || 0}%`,
                                            background: getCacheRateColor(metrics.cache?.tableHitRate)
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                        {(metrics.cache?.indexHits !== undefined || metrics.cache?.tableHits !== undefined) && (
                            <div className={styles.cacheStats}>
                                <div className={styles.cacheStat}>
                                    <span className={styles.cacheStatLabel}>Index Hits</span>
                                    <span className={styles.cacheStatValue}>
                                        {formatNumber(metrics.cache?.indexHits)}
                                    </span>
                                </div>
                                <div className={styles.cacheStat}>
                                    <span className={styles.cacheStatLabel}>Index Reads</span>
                                    <span className={styles.cacheStatValue}>
                                        {formatNumber(metrics.cache?.indexReads)}
                                    </span>
                                </div>
                                <div className={styles.cacheStat}>
                                    <span className={styles.cacheStatLabel}>Table Hits</span>
                                    <span className={styles.cacheStatValue}>
                                        {formatNumber(metrics.cache?.tableHits)}
                                    </span>
                                </div>
                                <div className={styles.cacheStat}>
                                    <span className={styles.cacheStatLabel}>Table Reads</span>
                                    <span className={styles.cacheStatValue}>
                                        {formatNumber(metrics.cache?.tableReads)}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Stats Grid */}
                    <div className={styles.statsGrid}>
                        {/* Connection Stats */}
                        <div className={styles.statCard}>
                            <div className={styles.statCardHeader}>
                                <Server size={18} />
                                <h3>Connections</h3>
                            </div>
                            <div className={styles.statCardContent}>
                                <div className={styles.connectionStat}>
                                    <span className={styles.connectionLabel}>Max Connections</span>
                                    <span className={styles.connectionValue}>
                                        {metrics.connections?.maxConnections || 'N/A'}
                                    </span>
                                </div>
                                <div className={styles.connectionStat}>
                                    <span className={styles.connectionLabel}>Active</span>
                                    <span className={styles.connectionValue}>
                                        {metrics.connections?.activeConnections || 'N/A'}
                                    </span>
                                </div>
                                <div className={styles.connectionStat}>
                                    <span className={styles.connectionLabel}>Utilization</span>
                                    <span className={styles.connectionValue}>
                                        {metrics.connections?.utilization || 'N/A'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Edge Functions */}
                        <div className={styles.statCard}>
                            <div className={styles.statCardHeader}>
                                <Zap size={18} />
                                <h3>Edge Functions</h3>
                            </div>
                            <div className={styles.statCardContent}>
                                {metrics.edgeFunctions?.available ? (
                                    <>
                                        <div className={styles.edgeStat}>
                                            <span className={styles.edgeLabel}>Invocations (24h)</span>
                                            <span className={styles.edgeValue}>
                                                {metrics.edgeFunctions?.invocations24h || 0}
                                            </span>
                                        </div>
                                        <div className={styles.edgeStat}>
                                            <span className={styles.edgeLabel}>Success Rate</span>
                                            <span
                                                className={styles.edgeValue}
                                                style={{
                                                    color: parseFloat(metrics.edgeFunctions?.successRate) >= 95
                                                        ? 'var(--accent-green)'
                                                        : 'var(--accent-yellow)'
                                                }}
                                            >
                                                {metrics.edgeFunctions?.successRate}%
                                            </span>
                                        </div>
                                        <div className={styles.edgeStat}>
                                            <span className={styles.edgeLabel}>Errors (24h)</span>
                                            <span
                                                className={styles.edgeValue}
                                                style={{
                                                    color: metrics.edgeFunctions?.errors24h > 0
                                                        ? 'var(--accent-red)'
                                                        : 'var(--accent-green)'
                                                }}
                                            >
                                                {metrics.edgeFunctions?.errors24h || 0}
                                            </span>
                                        </div>
                                    </>
                                ) : (
                                    <p className={styles.unavailable}>
                                        {metrics.edgeFunctions?.message}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Table Statistics */}
                    <div className={styles.tableStatsCard}>
                        <div className={styles.tableStatsHeader}>
                            <BarChart3 size={20} />
                            <h3>Table Statistics</h3>
                        </div>
                        <div className={styles.tableStatsGrid}>
                            {Object.entries(metrics.tables || {}).map(([table, count]) => (
                                <div key={table} className={styles.tableStatItem}>
                                    <div className={styles.tableName}>
                                        {table.replace(/_/g, ' ')}
                                    </div>
                                    <div className={styles.tableCount}>
                                        {formatNumber(count)}
                                    </div>
                                    <div className={styles.tableLabel}>rows</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Info Card */}
                    <div className={styles.infoCard}>
                        <Info size={18} />
                        <div>
                            <strong>About Cache Hit Rate</strong>
                            <p>
                                Your cache hit rate measures how often data is served from memory vs. disk.
                                A rate above 99% is excellent and indicates optimal database performance.
                                Higher cache hit rates mean faster queries and lower database load.
                            </p>
                        </div>
                    </div>
                </>
            ) : null}
        </div>
    );
};

export default AdminDatabaseMetrics;
