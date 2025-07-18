import { ActionIcon, Box, Button, Drawer, Flex, List, Paper, Textarea, TextInput, ThemeIcon, Tooltip } from "@mantine/core";
import { useAuth } from "../../lib/auth";
import { useProjects } from "../../lib/contexts/projects";
import { IconCircleCheck, IconPencil, IconTrashFilled } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useDisclosure } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { ProjectResponse } from "../../lib/types";

interface ProjectFormData {
    name: string;
    description: string;
}

export default function Projects() {
    const [opened, { toggle, close }] = useDisclosure();
    const { user } = useAuth()
    const { projects, createProject, deleteProject, updateProject } = useProjects()
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [project, setProject] = useState<ProjectResponse>(null);

    const [formData, setFormData] = useState<ProjectFormData>({
        name: project?.name ? project.name : "",
        description: project?.description ? project.description : "",
    });

    useEffect(() => {
        if (project) {
            setFormData({
                name: project.name || "",
                description: project.description || "",
            });
        } else {
            setFormData({
                name: "",
                description: "",
            });
        }
    }, [project]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            if (project) {
                await updateProject(project.id, formData);
            } else {
                await createProject(formData);
            }
            setFormData({ name: "", description: "" });
            setProject(null);
            close();
        } catch (error) {
            console.error("Error creating project:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteProject(id);
        } catch (error) {
            console.error("Error deleting project:", error);
        } finally {
        }
    };

    return <Box>
        <Flex direction={"row"} justify={"flex-end"}>
            {!user.is_subscribed ?
                <Tooltip label="Subscription Needed">
                    <Button onClick={toggle} disabled={!user.is_subscribed}>New Project</Button>
                </Tooltip>
                :
                <Button onClick={toggle} disabled={!user.is_subscribed}>New Project</Button>
            }
        </Flex>
        {projects.length === 0 ? (
            <div>
                <h3>No projects yet!</h3>
                <p>Create your first project to get started</p>
            </div>
        ) : (
            <List
                spacing="sm"
                icon={
                    <ThemeIcon color="teal" size={24} radius="xl">
                        <IconCircleCheck size={16} />
                    </ThemeIcon>
                }
            >
                {projects.map((project) => (
                    <Paper
                        key={project.id}
                        style={{
                            cursor: "pointer",
                            width: "100%",
                        }}
                        shadow="md"
                        withBorder
                        p="md"
                        m={"xs"}
                    >
                        <Box onClick={() => router.push(`/projects/${project.id}`)}>
                            <h3>{project.name}</h3>
                            {project.description && (
                                <p style={{ color: "#718096", fontSize: "0.875rem" }}>
                                    {project.description}
                                </p>
                            )}
                        </Box>

                        <Flex direction={"row"} justify={"flex-end"} gap="xs">
                            <ActionIcon variant="filled" aria-label="Settings" onClick={() => handleDelete(project.id)}>
                                <IconTrashFilled style={{ width: '70%', height: '70%' }} stroke={1.5} />
                            </ActionIcon>
                            <ActionIcon variant="filled" aria-label="Settings" onClick={() => {
                                setProject(project)
                                toggle()
                            }}>
                                <IconPencil style={{ width: '70%', height: '70%' }} stroke={1.5} />
                            </ActionIcon>
                        </Flex>
                    </Paper>
                ))}
            </List>
        )}
        <Drawer
            position="right"
            opened={opened}
            onClose={toggle}
            title={project ? "Edit Project" : "Create New Project"}
            overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}
        >
            <form onSubmit={handleSubmit}>
                <Flex direction={"column"} gap={"md"}>
                    <TextInput
                        placeholder="Project Name"
                        value={formData.name}
                        onChange={(e) =>
                            setFormData((prev) => ({
                                ...prev,
                                name: e.target.value,
                            }))
                        }
                        required
                    />
                    <Textarea
                        placeholder="Project Description"
                        value={formData.description}
                        onChange={(e) =>
                            setFormData((prev) => ({
                                ...prev,
                                description: e.target.value,
                            }))
                        }
                    />
                    <Button type="submit" loading={isSubmitting}>
                        {project ? "Update Project" : "Create Project"}
                    </Button>
                </Flex>
            </form>
        </Drawer>
    </Box>
}