import { ARTICLE_CARD_FIELDS } from "@/components/ArticleCard";
import FirebaseAvatar from "@/components/FirebaseAvatar";
import BusinessIcon from "@mui/icons-material/Business";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import gql from "graphql-tag";

const ArticlesQuery = gql`
  ${ARTICLE_CARD_FIELDS}
  query SubmissionsQuery($where: SubmissionWhereInput!) {
    submissions(where: $where) {
      id
      createdAt
      owner {
        id
        name
      }
      article {
        ...ArticleCardFields
      }
      reviewRequests {
        user {
          ...UserCardFields
        }
        submission {
          venue {
            id
            name
          }
        }
      }
    }
  }
`;

export default function UserDetailsCard({ user }) {
  const { profilePictureUrl, institution, website, name } = user;
  const iconSx = { fontSize: "1.2rem", verticalAlign: "middle", mr: 0.3 };
  return (
    <Box
      sx={{
        p: 1,
      }}
    >
      <Box
        sx={{
          display: "flex",
        }}
      >
        <FirebaseAvatar name={name} storeRef={profilePictureUrl} />
        <Typography
          variant="h6"
          sx={{
            p: 1,
          }}
        >
          {name}
        </Typography>
      </Box>
      {institution && (
        <Typography sx={{ mt: 1 }}>
          <BusinessIcon sx={iconSx} />
          {institution}
        </Typography>
      )}
      {website && (
        <Box sx={{ mt: 1 }}>
          <OpenInNewIcon sx={iconSx} />
          <Link variant="body1">{website}</Link>
        </Box>
      )}
    </Box>
  );
}
