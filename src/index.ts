/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * @csoai/real-estate-ai
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Copyright (c) 2026 CSGA Global. All rights reserved.
 * Part of the CSGA Global MCP Ecosystem.
 *
 * LEGAL NOTICE: This software is provided for informational and advisory
 * purposes only. It does not constitute legal, regulatory, or professional
 * compliance advice. Users should consult qualified legal counsel for
 * jurisdiction-specific compliance requirements.
 *
 * License: CC0-1.0 (Creative Commons Zero v1.0 Universal)
 * SPDX-License-Identifier: CC0-1.0
 *
 * Build Timestamp: 2026-02-26T06:00:00Z
 * Last Modified:   2026-02-26T06:00:00Z
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { handleRealEstateAiCompliance } from "./tools/real-estate-ai-compliance.js";

const server = new McpServer({
  name: "csoai-real-estate-ai-mcp",
  version: "1.0.0"
});

// Schemas extracted to avoid TS2589 deep instantiation
const RealEstateAiComplianceShape = {
  system_name: z.string().describe("Name of real estate AI system"),
  ai_function: z.string().describe("Function (automated valuation/AVM, tenant screening, ad targeting, property recommendation, smart building)"),
  data_inputs: z.string().describe("Data inputs (property data, credit, criminal, demographics, satellite imagery, social)"),
  fair_housing_impact: z.string().describe("Impact on protected classes (race, color, religion, national origin, sex, disability, familial status)"),
  jurisdiction: z.string().describe("Operating jurisdiction (US/FHA, EU, UK, Australia, etc.)"),
};

// ─── Tool 1: real_estate_ai_compliance ───
(server.tool as any)(
  "real_estate_ai_compliance",
  "Assess regulatory compliance for AI in real estate. Covers fair housing, automated valuation, tenant screening, and advertising discrimination.",
  RealEstateAiComplianceShape,
  async (args: any) => {
    const result = handleRealEstateAiCompliance(args.system_name, args.ai_function, args.data_inputs, args.fair_housing_impact, args.jurisdiction);
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(console.error);
