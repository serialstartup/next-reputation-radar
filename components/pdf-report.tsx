import React from "react"
import { Page, Text, View, Document, StyleSheet, Font } from "@react-pdf/renderer"
import type { WeeklyReport, KPI, SentimentDataPoint } from "@/lib/types"

// PDF Styles
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Helvetica",
    fontSize: 10,
  },
  header: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: "#6b7280",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#111827",
  },
  grid: {
    flexDirection: "row",
    gap: 10,
  },
  card: {
    flex: 1,
    padding: 12,
    backgroundColor: "#f9fafb",
    borderRadius: 4,
  },
  cardLabel: {
    fontSize: 9,
    color: "#6b7280",
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
  },
  cardChange: {
    fontSize: 9,
    marginTop: 2,
  },
  positive: {
    color: "#10b981",
  },
  negative: {
    color: "#ef4444",
  },
  table: {
    marginTop: 10,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    paddingVertical: 8,
  },
  tableHeader: {
    backgroundColor: "#f9fafb",
    fontWeight: "bold",
  },
  tableCell: {
    flex: 1,
    fontSize: 9,
  },
  tableCellLarge: {
    flex: 3,
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    fontSize: 8,
  },
  badgePositive: {
    backgroundColor: "#d1fae5",
    color: "#065f46",
  },
  badgeNegative: {
    backgroundColor: "#fee2e2",
    color: "#991b1b",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: "center",
    fontSize: 8,
    color: "#9ca3af",
  },
})

interface PDFReportProps {
  report: WeeklyReport
  kpis: KPI[]
  sentimentData: SentimentDataPoint[]
  businessName?: string
  generatedAt?: Date
}

export function PDFReport({ 
  report, 
  kpis, 
  sentimentData,
  businessName = "Reputation Radar",
  generatedAt = new Date(),
}: PDFReportProps) {
  const totalSentiment = 
    report.sentiment_breakdown.positive + 
    report.sentiment_breakdown.negative + 
    report.sentiment_breakdown.neutral

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{businessName}</Text>
          <Text style={styles.subtitle}>Weekly Reputation Report • {report.period}</Text>
          <Text style={{ fontSize: 8, color: "#9ca3af", marginTop: 4 }}>
            Generated on {generatedAt.toLocaleDateString()} at {generatedAt.toLocaleTimeString()}
          </Text>
        </View>

        {/* KPIs */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Metrics</Text>
          <View style={styles.grid}>
            {kpis.map((kpi, index) => (
              <View key={index} style={styles.card}>
                <Text style={styles.cardLabel}>{kpi.label}</Text>
                <Text style={styles.cardValue}>{kpi.value}</Text>
                {kpi.change !== undefined && (
                  <Text
                    style={[
                      styles.cardChange,
                      kpi.change && kpi.change > 0 ? styles.positive : styles.negative,
                    ]}
                  >
                    {kpi.change > 0 ? "+" : ""}{kpi.change} {kpi.changeLabel}
                  </Text>
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Sentiment Breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sentiment Analysis</Text>
          <View style={styles.grid}>
            <View style={styles.card}>
              <Text style={styles.cardLabel}>Positive</Text>
              <Text style={[styles.cardValue, styles.positive]}>
                {report.sentiment_breakdown.positive} ({Math.round((report.sentiment_breakdown.positive / totalSentiment) * 100)}%)
              </Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.cardLabel}>Neutral</Text>
              <Text style={styles.cardValue}>
                {report.sentiment_breakdown.neutral} ({Math.round((report.sentiment_breakdown.neutral / totalSentiment) * 100)}%)
              </Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.cardLabel}>Negative</Text>
              <Text style={[styles.cardValue, styles.negative]}>
                {report.sentiment_breakdown.negative} ({Math.round((report.sentiment_breakdown.negative / totalSentiment) * 100)}%)
              </Text>
            </View>
          </View>
        </View>

        {/* Top Issues */}
        {report.top_issues && report.top_issues.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Top Issues This Week</Text>
            <View style={styles.table}>
              {report.top_issues.map((issue, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={[styles.tableCell, styles.tableCellLarge]}>{issue}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Highlights */}
        {report.highlights && report.highlights.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Highlights</Text>
            <View style={styles.table}>
              {report.highlights.map((highlight, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={[styles.tableCell, styles.tableCellLarge]}>{highlight}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Top Wins */}
        {report.top_wins && report.top_wins.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Top Wins</Text>
            <View style={styles.table}>
              {report.top_wins.map((win, index) => (
                <View key={index} style={styles.tableRow}>
                  <View style={{ flex: 0.5 }}>
                    <Text style={styles.badge}>{(index + 1).toString()}</Text>
                  </View>
                  <View style={{ flex: 3 }}>
                    <Text style={styles.tableCellLarge}>{win.title}</Text>
                    {win.detail && (
                      <Text style={{ fontSize: 8, color: "#6b7280", marginTop: 2 }}>
                        {win.detail}
                      </Text>
                    )}
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Footer */}
        <Text style={styles.footer}>
          Generated by Reputation Radar • www.reputationradar.com
        </Text>
      </Page>
    </Document>
  )
}

export default PDFReport
