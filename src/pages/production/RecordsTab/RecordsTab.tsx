import React from "react";

import BasicAccordion, { BasicAccordionItem } from "../../../components/BasicAccordion/BasicAccordion";
import SkillsAccordionItem from "./SkillsAccordionItem";
import ResourcesAccordionItem from "./ResourcesAccordionItem";
import TasksAccordionItem from "./TasksAccordionItem";
import BasicTagInput from "../../../components/TagInput/BasicTagInput";


export default function RecordsTab({}: {}) {

    return (<>
        <BasicAccordion allowMultiple={false}>
            <BasicAccordionItem title="Skills" description="Skills are pieces of knowledge">
                <SkillsAccordionItem />
            </BasicAccordionItem>
            <BasicAccordionItem title="Resources" description="Resources are productive agents">
                <ResourcesAccordionItem />
            </BasicAccordionItem>
            <BasicAccordionItem title="Tasks" description="Tasks are units of work">
                <TasksAccordionItem />
            </BasicAccordionItem>
        </BasicAccordion>

        {/* <BasicTagInput type="product" mode={'create'} onSubmit={(row) => {}} /> */}
    </>);
}
