import React, { useState } from "react";
import ProductSchema from "./ProductSchema";
import { Button, FormHelperText, TextField } from "@mui/material";
import {
  Container,
  Grid,
  InputAdornment,
  ImageList,
  ImageListItem,
  Box,
} from "@mui/material";

const URLS = {
  POST_PRODUCT: "api/products"
}

function AddProduct() {
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    files: [],
    errors: {
      name: "",
      description: "",
      price: "",
      files: "",
    },
  });
  const [loading, setLoading] = useState(false);


  const { name, description, price, files, errors } = product;

  function handleChange(ev) {
    setProduct((product) => {
      return { ...product, [ev.target.name]: ev.target.value };
    });
  }

  function handleUploadImages(ev) {
    setProduct((product) => ({ ...product, files: ev.target.files }));
  }

  async function submitData(ev) {
    ev.preventDefault();
    // validate data
    try {
      await ProductSchema.validate(product, { abortEarly: false });
    } catch (err) {
      const errors = {};

      err.inner.forEach((e) => {
        errors[e.path] = e.message;
      });
      setProduct((product) => ({ ...product, errors }));
      return;
    }


    // send data to the server;
    const fd = new FormData();
    for(let key in product) {
      if(key === "errors" || key === "files") continue;
      fd.append(key, product[key]);
    } 

    [...product.files].forEach((file) => {
      fd.append("files", file);
    })


    fetch(URLS.POST_PRODUCT, {
      body: fd,
      method: "POST"
    })
    .then((res) => {
      setLoading(true);

      if(!res.ok) {
         throw new Error("4XX status");
      }
      // parse the response
      return res.json();
    })
    .then((data) => {
      setProduct({
        name: "",
        description: "",
        price: "",
        files: [],
        errors: {
          name: "",
          description: "",
          price: "",
          files: "",
        },
      })
    })
    .catch((err) => {
    })
    .finally(() => {
      setLoading(false);
    })
    
  }



  return (
    <Container maxWidth="sm" sx={{ my: 2 }}>
      <form method="POST" onSubmit={submitData} encType="multipart/form-data">
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={name}
            onChange={handleChange}
          />
           {errors.name && <FormHelperText sx={{color: "red"}}>{errors.name}</FormHelperText>}
        </Grid>
        <Grid item xs={12}>
          <TextField
            multiline
            rows={3}
            fullWidth
            label="Description"
            name="description"
            value={description}
            onChange={handleChange}
          />
        {errors.description && <FormHelperText sx={{color: "red"}}>{errors.description}</FormHelperText>}
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Price"
            name="price"
            value={price}
            onChange={handleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">$</InputAdornment>
              ),
            }}
          />
           {errors.price && <FormHelperText sx={{color: "red"}}>{errors.price}</FormHelperText>}
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" color="secondary" component="label">
            Upload some images
            <input
              name="files"
              onChange={handleUploadImages}
              hidden
              accept="image/*"
              multiple
              type="file"
            />
          </Button>
          {!!errors.files.length && <FormHelperText sx={{color: "red"}}>{errors.files}</FormHelperText>}
        </Grid>
        <Grid item xs={12}>
          <Preview fileList={files} />
        </Grid>
       
        <Grid item xs={12}>
          <Button disabled={loading} type="submit" variant="contained"  >
            Submit
          </Button>
        </Grid>
      </Grid>
      </form>
    </Container>
  );
}

export default AddProduct;

function Preview(props) {
  const { fileList } = props;
  if (!fileList.length) return <></>;

  const imagesJsx = [...fileList].map((file, idx) => {
    const url = URL.createObjectURL(file);

    function handleLoad() {
      URL.revokeObjectURL(url);
    }

    return (
      <ImageListItem key={idx}>
        <img src={url} alt={file.name} onLoad={handleLoad} />
      </ImageListItem>
    );
  });

  return (
    <Box>
      <ImageList cols={12}>{imagesJsx}</ImageList>
    </Box>
  );
}
