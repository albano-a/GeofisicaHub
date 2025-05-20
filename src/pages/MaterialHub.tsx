import { Link } from "react-router-dom";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

const materials = [
  {
    name: "Calculus",
    path: "/hub/calculus",
    desc: "Learn about Calculus.",
  },
  { name: "Geology", path: "/hub/geology", desc: "Explore Geology." },
  {
    name: "Geophysics",
    path: "/hub/geophysics",
    desc: "Discover Geophysics.",
  },
  { name: "Physics", path: "/hub/physics", desc: "Understand Physics." },
  {
    name: "Programming",
    path: "/hub/programming",
    desc: "Study Programming.",
  },
];

export default function MaterialHub() {
  return (
    <section className="w-full max-w-7xl mx-auto p-10 flex flex-col items-center space-y-10">
      <Box sx={{ flexGrow: 1, py: 6, px: { xs: 2, sm: 6 } }}>
        <Typography
          variant="h4"
          component="h1"
          align="center"
          gutterBottom
          sx={{ fontWeight: 700, mb: 4 }}
        >
          Material Hub
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {materials.map((mat) => (
            <Grid size={{ xs: 12, sm: 6, md: 3, lg: 3 }} key={mat.name}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  boxShadow: 3,
                  "&:hover": {
                    transform: "scale(1.04)",
                    boxShadow: 8,
                  },
                  borderRadius: 3,
                  background:
                    "linear-gradient(135deg, #e0e7ff 0%, #f0fdfa 100%)",
                }}
                variant="outlined"
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography
                    variant="h6"
                    component="div"
                    sx={{
                      mb: 1,
                      fontWeight: 600,
                      color: "primary.main",
                      letterSpacing: 1,
                    }}
                  >
                    {mat.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {mat.desc}
                  </Typography>
                </CardContent>
                <CardActions sx={{ px: 2, pb: 2 }}>
                  <Button
                    component={Link}
                    to={mat.path}
                    variant="contained"
                    color="primary"
                    size="medium"
                    fullWidth
                    sx={{
                      borderRadius: 2,
                      fontWeight: 500,
                      textTransform: "none",
                      boxShadow: "none",
                    }}
                  >
                    Go to {mat.name}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </section>
  );
}
