import { Container, Text, Title } from "@mantine/core";
import { useAuth } from "../../lib/auth";


export default function Profile() {
    const { user, } = useAuth()

    return <Container>
        <Title>Manage Your Profile</Title>
        <Text>{user.first_name}</Text>
        <Text>{user.last_name}</Text>
        <Text>{user.email}</Text>
    </Container>
}