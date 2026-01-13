import React from "react";
import { MissingAnnotationEmptyState, useEntity } from "@backstage/plugin-catalog-react";
import { Content, ContentHeader, Page, SupportButton } from "@backstage/core-components";
import { CpuGraph } from "../components/CpuGraphComponent/CpuGraphComponent";



export const VmPage: React.FC = () => {
    const { entity } = useEntity();

    const vmTitle = entity.metadata.title;
    const nodeId = entity.metadata.annotations?.['proxmox.io/node-id'];
    const vmId = Number(entity.metadata.annotations?.['proxmox.io/vm-id']);

    if (isNaN(vmId) || !nodeId) { 
        return (
            <MissingAnnotationEmptyState 
                annotation={["proxmox.io/vm-id", "proxmox.io/node-id"]}
            />
        ); 
    }

    return (
        <Page themeId="tool">
            <Content>
                <ContentHeader title={`${vmTitle}: ${vmId}`}>
                    <SupportButton />
                </ContentHeader>

                <CpuGraph nodeId={nodeId} vmId={vmId} />
            </Content>
        </Page>
    );
}