import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { useState, useEffect } from "react";
import axios from "axios";
import { Grid } from "@mui/material";
import { Container } from "@mui/system";

const url = "http://localhost:3004/api/products";

export default function Products() {
  console.log('grid will solve the problem of that poor layout')
  const [data, setData] = useState([]);
  const [err, setErr] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchData() {
      try {
        const data = await axios.get(url, {
          signal: controller.signal,
        });
        setData(data.data);
        setErr(null);
      } catch (err) {
        setErr("something went wrong. Try refreshing");
      }
    }
    fetchData();

    return () => {
      controller.abort();
    };
  }, []);

  if (err) return err;

  return (
    <Container maxWidth="md" sx={{ my: 2 }}>
      <Grid container spacing={2} justifyContent="center" alignItems="center">
        {data.map((product, i) => (
          <CardComponent key={i} product={product} />
        ))}
      </Grid>
    </Container>
  );
}

function CardComponent(props) {
  const {
    product: { name, description, url, price },
  } = props;
  return (
    <Grid  item xs={5} >
      <Card sx={{ maxWidth: 345 }}>
        <CardMedia sx={{ height: 140 }} image={url} title="name" />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {`${name} ${price}`}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );
}

